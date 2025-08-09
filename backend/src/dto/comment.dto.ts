import { Rule, RuleType } from '@midwayjs/validate';

export class CreateCommentDTO {
  @Rule(RuleType.number().required())
  playerShowId: number;

  @Rule(RuleType.string().required())
  content: string;
}
