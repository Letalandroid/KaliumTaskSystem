import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Task, TaskStatus, TaskPriority } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskManager implements OnModuleInit {
  private readonly logger = new Logger(TaskManager.name);

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log('[Kalium] Task System Inicializado');
    await this.seedTasks();
  }

  private async seedTasks() {
    const count = await this.prisma.task.count();
    if (count === 0) {
      this.logger.log('Seeding initial tasks for Kalium test...');
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
    return this.prisma.task.findUnique({
      where: { id },
    }) as unknown as Task | null;
  }

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.prisma.task.create({
      data: {
        title: createTaskDto.title,
        priority: createTaskDto.priority || TaskPriority.MEDIUM,
        status: createTaskDto.status || TaskStatus.PENDING,
      },
    }) as unknown as Task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    }) as unknown as Task | null;
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
