/**
 * @see https://github.com/johnsoncodehk/volar/tree/master/extensions/vscode-vue-language-features#usage
 * Define Global Components
 */
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    RouterLink: typeof import('vue-router')['RouterLink']
    RouterView: typeof import('vue-router')['RouterView']
  }
}

export {}
