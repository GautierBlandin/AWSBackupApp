import { createInjectionToken } from '@bucket-backup/di-container';

export interface DateService {
  now(): Date;
}

export const dateServiceToken = createInjectionToken<DateService>('DateService');

export class DateServiceImpl implements DateService {
  now(): Date {
    return new Date();
  }
}

export class MockDateService implements DateService {
  private currentDate: Date;

  constructor() {
    this.currentDate = new Date();
  }

  now(): Date {
    return this.currentDate;
  }

  setCurrentDate(date: Date): void {
    this.currentDate = date;
  }
}
