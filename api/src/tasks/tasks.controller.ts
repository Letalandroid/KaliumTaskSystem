import { Controller, Get, Post, Body, Patch, Param, Delete, Post as PostMethod } from '@nestjs/common';
import { TaskManager } from './task-manager.service';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskManager: TaskManager) {}

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskManager.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task | null> {
    return this.taskManager.findOne(id);
  }

  @Post()
  create(@Body() taskData: Partial<Task>): Promise<Task> {
    return this.taskManager.create(taskData);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Task>): Promise<Task | null> {
    return this.taskManager.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.taskManager.remove(id);
  }

  @Post('activate-kalium')
  activateKaliumMode(): Promise<Task[]> {
    return this.taskManager.activateKaliumMode();
  }
}
