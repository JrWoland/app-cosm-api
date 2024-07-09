import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { controllers, useCases } from './use-cases';
import { repos, reposModels } from './repos';

@Module({
  imports: [CqrsModule, MongooseModule.forFeature(reposModels)],
  controllers: controllers,
  providers: [...useCases, ...repos],
})
export class BeautySalonModule {}
