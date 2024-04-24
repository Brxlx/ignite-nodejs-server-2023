import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { DomainEvents } from '@/core/events/domain-events';
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository';
import { Student } from '@/domain/forum/enterprise/entities/student';

export class InMemoryStudentsRepository implements StudentsRepository {
  // public items: Student[] = [];
  public items = new Map<UniqueEntityID, Student>();

  async findByEmail(email: string): Promise<Student | null> {
    const student = Array.from(this.items.values()).find(item => item.email === email);

    if (!student) return null;

    return student;
  }

  async create(student: Student): Promise<void> {
    // this.items.push(student);
    this.items.set(student.id, student);
    DomainEvents.dispatchEventsForAggregate(student.id);
  }
}
