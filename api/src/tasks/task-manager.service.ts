import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';

@Injectable()
export class TaskManager implements OnModuleInit {
  private readonly logger = new Logger(TaskManager.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log('[Kalium] Task System Inicializado');
    await this.seedTasks();
  }

  private async seedTasks() {
    const count = await this.prisma.task.count();
    if (count === 0) {
      const initialTasks = [
        { title: 'Pentesting web app', priority: TaskPriority.HIGH, status: TaskStatus.PENDING },
        { title: 'Desarrollo backend modulo', priority: TaskPriority.MEDIUM, status: TaskStatus.PENDING },
        { title: 'Analisis software sospechoso', priority: TaskPriority.HIGH, status: TaskStatus.PENDING },
      ];
      await this.prisma.task.createMany({ data: initialTasks });
      this.logger.log('Preloaded initial tasks successfully.');
    }
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    }) as unknown as Task[];
  }

  async findOne(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } }) as unknown as Task;
  }

  async create(taskData: Partial<Task>): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: taskData.title!,
        priority: taskData.priority || TaskPriority.MEDIUM,
        status: taskData.status || TaskStatus.PENDING,
      },
    }) as unknown as Task;
  }

  async update(id: string, updateData: Partial<Task>): Promise<Task | null> {
    return this.prisma.task.update({
      where: { id },
      data: updateData as any,
    }) as unknown as Task;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }

  async activateKaliumMode(): Promise<Task[]> {
    this.logger.log('Kalium Mode Activated: Filtering HIGH priority tasks.');
    return this.prisma.task.findMany({
      where: { priority: TaskPriority.HIGH },
    }) as unknown as Task[];
  }
}
