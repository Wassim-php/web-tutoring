import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TutorsService } from './tutors.service';
import { Tutor } from './entities/tutor.entity';
import { UpdateTutorInput } from './dto/update-tutor.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Resolver(() => Tutor)
@UseGuards(JwtAuthGuard)
export class TutorsResolver {
  constructor(private readonly tutorsService: TutorsService) {}

  @Query(() => [Tutor])
  async tutors() {
    return this.tutorsService.findAll();
  }

  @Query(() => Tutor)
  async tutor(@Args('id', { type: () => Int }) id: number) {
    return this.tutorsService.findOne(id);
  }

  @Mutation(() => Tutor)
  async updateTutor(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateData') updateData: UpdateTutorInput
  ) {
    return this.tutorsService.update(id, updateData);
  }
}