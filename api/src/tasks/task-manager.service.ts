import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';

@Injectable()
export class TaskManager implements OnModuleInit {
  private readonly logger = new Logger(TaskManager.name);

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async onModuleInit() {
    this.logger.log('[Kalium] Task System Inicializado');
    await this.seedTasks();
  }

  private async seedTasks() {
    const count = await this.taskRepository.count();
    if (count === 0) {
      const initialTasks = [
        { title: 'Pentesting web app', priority: TaskPriority.HIGH, status: TaskStatus.PENDING },
        { title: 'Desarrollo backend modulo', priority: TaskPriority.MEDIUM, status: TaskStatus.PENDING },
        { title: 'Analisis software sospechoso', priority: TaskPriority.HIGH, status: TaskStatus.PENDING },
      ];
      await this.taskRepository.save(initialTasks);
      this.logger.log('Preloaded initial tasks successfully.');
    }
  }

  async findAll(): Promise<Task[]> {
    return this.taskRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Task | null> {
    return this.taskRepository.findOneBy({ id });
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    const task = this.taskRepository.create(taskData);
    return this.taskRepository.save(task);
  }

  async update(id: string, updateData: Partial<Task>): Promise<Task | null> {
    await this.taskRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }

  /**
   * Método obligatorio: activateKaliumMode()
   * Filtra tareas con priority == "HIGH"
   */
  async activateKaliumMode(): Promise<Task[]> {
    this.logger.log('Kalium Mode Activated: Filtering HIGH priority tasks.');
    return this.taskRepository.findBy({ priority: TaskPriority.HIGH });
  }
}
