import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TaskManager } from './task-manager.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

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
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskManager.create(createTaskDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    return this.taskManager.update(id, updateTaskDto);
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
