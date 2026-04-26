import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { SalarySubmission } from './entities/salary-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalarySubmission])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
