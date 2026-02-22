// globals.d.ts
declare module "*.css";
declare module "*.scss";
declare module "*.module.css";
declare module "qrcode" {
  export function toDataURL(
    text: string,
    options?: {
      width?: number;
      margin?: number;
    }
  ): Promise<string>;
}
