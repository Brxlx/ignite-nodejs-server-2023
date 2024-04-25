import { FakeHasher } from 'test/cryptography/fake-hasher';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

import { RegisterStudentUseCase } from './register-student-use-case';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
// system under test
let sut: RegisterStudentUseCase;

describe('Register Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakeHasher);
  });
  it('should be able to register a new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      student: Array.from(inMemoryStudentsRepository.items.values())[0],
      // student: inMemoryStudentsRepository.items.get(result.value?.student?.id),
    });
  });

  it('should hash student password upon registration', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    });

    const hashedPassword = await fakeHasher.hash('12345678');

    expect(Array.from(inMemoryStudentsRepository.items.values())[0].password === hashedPassword);
  });
});
