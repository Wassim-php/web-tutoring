import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { StudentsService } from './students.service';
import { Student } from './entities/student.entity';
import { UpdateStudentInput } from './dto/update-student.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Student)
@UseGuards(JwtAuthGuard)
export class StudentsResolver {
  constructor(private readonly studentsService: StudentsService) {}

  @Query(() => [Student])
  async students() {
    return this.studentsService.findAll();
  }

  @Query(() => Student)
  async student(@Args('id', { type: () => Int }) id: number) {
    return this.studentsService.findOne(id);
  }

  @Mutation(() => Student)
  async updateStudent(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateData') updateData: UpdateStudentInput
  ) {
    return this.studentsService.update(id, updateData);
  }
}