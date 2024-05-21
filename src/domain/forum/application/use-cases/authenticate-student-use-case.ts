import { Injectable } from '@nestjs/common';
import { WrongSecretProviderError } from '@nestjs/jwt';

import { Either, left, right } from '@/core/types/either';

import { Encrypter } from '../gateways/cryptography/encrypter';
import { HashComparer } from '../gateways/cryptography/hash-comparer';
import { StudentsRepository } from '../repositories/students-repository';
import { WrongCredentialsError } from './errors/wrong-credentials.error';

interface AuthenticateStudentRequest {
  email: string;
  password: string;
}

type AuthenticateStudentResponse = Either<
  WrongSecretProviderError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter
  ) {}

  public async execute({
    email,
    password,
  }: AuthenticateStudentRequest): Promise<AuthenticateStudentResponse> {
    const student = await this.studentsRepository.findByEmail(email);

    if (!student) return left(new WrongCredentialsError());

    const isValidPassword = await this.hashComparer.compare(password, student.password);
    if (!isValidPassword)
      return left(new WrongSecretProviderError('User credentials do not match'));

    const accessToken = await this.encrypter.encrypt({ sub: student.id.toString() });

    return right({ accessToken });
  }
}
