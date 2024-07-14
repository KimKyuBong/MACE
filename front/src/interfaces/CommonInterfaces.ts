export interface ErrorDetail {
    detail: string | { msg: string };
  }
  
export interface ErrorProps {
    error: ErrorDetail;
  }
  