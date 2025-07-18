declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
  }
  
  export const Filter: FC<IconProps>;
  export const Grid: FC<IconProps>;
  export const List: FC<IconProps>;
  export const LogIn: FC<IconProps>;
  export const LogOut: FC<IconProps>;
} 