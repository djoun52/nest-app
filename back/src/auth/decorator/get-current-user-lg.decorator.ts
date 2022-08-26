import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../auth/types';

export const GetCurrentUserLg = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    //const user = request.user as JwtPayload;
    console.log(request);
    return request.user.id;
  },
);
