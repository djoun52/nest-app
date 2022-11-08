import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserLg = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    console.log(request);
    return request.user.id;
  },
);
