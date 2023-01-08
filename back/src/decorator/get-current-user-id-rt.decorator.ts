import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserIdRt = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.user.sub;
  },
);
