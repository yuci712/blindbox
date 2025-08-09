import { Rule, RuleType } from '@midwayjs/validate';

export class CreatePlayerShowDTO {
  @Rule(RuleType.string().required())
  content: string;

  @Rule(RuleType.string().optional())
  imageUrl?: string;
}

export class LikePlayerShowDTO {
    @Rule(RuleType.number().required())
    id: number;
}
