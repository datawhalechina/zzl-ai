import { XiaojuSurveyPlugin } from '../interface';
import { SurveyResponse } from 'src/models/surveyResponse.entity';
import {
  decryptData,
  encryptData,
  isDataSensitive,
  desensitiveData,
} from './utils';

export class ResponseSecurityPlugin implements XiaojuSurveyPlugin {
  constructor(private readonly secretKey: string) {}
  beforeResponseDataCreate(responseData: SurveyResponse) {
    const secretKeys = [];
    if (responseData.data) {
      for (const key in responseData.data) {
        const value = responseData.data[key];
        const values = Array.isArray(value) ? value : [value];
        let needEncrypt = false;
        for (const val of values) {
          if (isDataSensitive(val)) {
            needEncrypt = true;
            break;
          }
        }
        if (needEncrypt) {
          secretKeys.push(key);
          responseData.data[key] = Array.isArray(value)
            ? value.map((item) =>
                encryptData(item, {
                  secretKey: this.secretKey,
                }),
              )
            : encryptData(value, {
                secretKey: this.secretKey,
              });
        }
      }
    }
    responseData.secretKeys = secretKeys;
  }

  afterResponseDataReaded(responseData: SurveyResponse) {
    const secretKeys = responseData.secretKeys;
    if (Array.isArray(secretKeys) && secretKeys.length > 0) {
      for (const key of secretKeys) {
        if (Array.isArray(responseData.data[key])) {
          responseData.data[key] = responseData.data[key].map((item) =>
            decryptData(item, { secretKey: this.secretKey }),
          );
        } else {
          responseData.data[key] = decryptData(responseData.data[key], {
            secretKey: this.secretKey,
          });
        }
      }
    }
    responseData.secretKeys = [];
  }

  desensitiveData(data: Record<string, any>) {
    Object.keys(data).forEach((key) => {
      if (isDataSensitive(data[key])) {
        data[key] = desensitiveData(data[key]);
      }
    });
  }
}
