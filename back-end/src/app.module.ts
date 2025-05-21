import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { TutorsModule } from './tutors/tutors.module';
import { StudentsModule } from './students/students.module';
import { Student } from './students/entities/student.entity';
import { Tutor } from './tutors/entities/tutor.entity';
import { AuthModule } from './auth/auth.module';
import { TopicsModule } from './topics/topics.module';
import { SessionModule } from './session/session.module';
import { MessagesModule } from './messages/messages.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true, // Enable GraphQL playground
      context: ({ req }) => ({ req }), // Add request context for auth
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'web_db',
      entities: [User, Student, Tutor],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TutorsModule,
    StudentsModule,
    AuthModule,
    TopicsModule,
    SessionModule,
    MessagesModule,
    ChatsModule,
  ],
})
export class AppModule {}
