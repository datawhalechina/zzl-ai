import { XiaojuSurveyPlugin } from './interface';

type AllowHooks =
  | 'beforeResponseDataCreate'
  | 'afterResponseDataReaded'
  | 'desensitiveData'
  | 'genSurveyPath';

export class XiaojuSurveyPluginManager {
  private plugins: Array<XiaojuSurveyPlugin> = [];
  // 注册插件
  registerPlugin(...plugins: Array<XiaojuSurveyPlugin>) {
    this.plugins.push(...plugins);
  }

  // 触发钩子
  async triggerHook(hookName: AllowHooks, data?: any) {
    for (const plugin of this.plugins) {
      if (plugin[hookName]) {
        return await plugin[hookName](data);
      }
    }
  }
}

export default new XiaojuSurveyPluginManager();
