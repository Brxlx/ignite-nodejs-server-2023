import { Injectable } from '@nestjs/common';

import { Either, left, right } from '@/core/types/either';

import { Student } from '../../enterprise/entities/student';
import { HashGenerator } from '../cryptography/hash-generator';
import { StudentsRepository } from '../repositories/students-repository';
import { StudentAlreadyExistsError } from './errors/student-already-exists.error';

interface RegisterStudentRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashGenerator: HashGenerator
  ) {}

  public async execute({
    name,
    email,
    password,
  }: RegisterStudentRequest): Promise<RegisterStudentResponse> {
    const studentExists = await this.studentsRepository.findByEmail(email);

    if (studentExists) return left(new StudentAlreadyExistsError(email));

    const hashedPassword = await this.hashGenerator.hash(password);

    const student = Student.create({ name, email, password: hashedPassword });

    await this.studentsRepository.create(student);

    return right({ student });
  }
}
