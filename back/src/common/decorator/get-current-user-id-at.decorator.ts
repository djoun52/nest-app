import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserIdAt = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    return request.user.id;
  },
);
