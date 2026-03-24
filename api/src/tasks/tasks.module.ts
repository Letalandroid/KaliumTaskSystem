import { Module } from '@nestjs/common';
import { TaskManager } from './task-manager.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [TasksController],
  providers: [TaskManager, PrismaService],
  exports: [TaskManager],
})
export class TasksModule {}
