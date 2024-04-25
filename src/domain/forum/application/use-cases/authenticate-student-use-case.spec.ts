import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeStudent } from 'test/factories/make-student';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';

import { AuthenticateStudentUseCase } from './authenticate-student-use-case';

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
// system under test
let sut: AuthenticateStudentUseCase;

describe('Authenticate Student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();

    sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter);
  });
  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      email: 'johndoe@email.com',
      password: await fakeHasher.hash('12345678'),
    });

    inMemoryStudentsRepository.items.set(student.id, student);

    const result = await sut.execute({
      email: 'johndoe@email.com',
      password: '12345678',
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      // student: inMemoryStudentsRepository.items.get(result.value?.student?.id),
    });
  });
});
