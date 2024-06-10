import Quill from 'quill';
import katex from 'katex';

declare global {
  interface Window {
    Quill: typeof Quill;
    katex: typeof katex;
  }
}