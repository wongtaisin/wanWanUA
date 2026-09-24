/*
 * @Author: wingddd wongtaisin1024@gmail.com
 * @Date: 2025-11-24 14:08:01
 * @LastEditors: wingddd wongtaisin1024@gmail.com
 * @LastEditTime: 2026-09-25 04:43:01
 * @FilePath: \wanWanUA\src\pages\chart\utils.ts
 * @Description: 图表工具函数
 *
 * Copyright (c) 2025 by wongtaisin1024@gmail.com, All Rights Reserved.
 */
import _utils from '@/utils/utils'

/**
 * @deprecated 获取当前日期所在周的周一和周日
 * @param {Date} data 可选，默认当前日期 yyyy-MM-dd
 * @returns 包含周一和周日的对象，格式为 { weekStart: 'yyyy-MM-dd', weekEnd: 'yyyy-MM-dd' }
 */
export const getWeekRange = (data?: Date): { weekStart: string; weekEnd: string } => {
  const now = data || new Date()
  const day = now.getDay() // 0 (周日) - 6 (周六)
  const diffToMonday = (day === 0 ? -6 : 1) - day // 周一与当前日期的差值
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday) // 周一
  const weekEnd = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 6) // 周日

  const fmt = (d: Date) => {
    return _utils.formatDate(d.getTime(), 'yyyy-MM-dd')
    // `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }

  return {
    weekStart: fmt(weekStart),
    weekEnd: fmt(weekEnd)
  }
}

/**
 * @deprecated 获取指定年份的周数
 * @param {number} year 年份 (例如: 2025)
 * @returns 该年的周数 (52 或 53)
 * @description 该函数根据年份判断是否为闰年，从而确定该年是否有 53 周。
 * 闰年判断：
 * - 能被 4 整除但不能被 100 整除的年份是闰年。
 * - 能被 400 整除的年份也是闰年。
 * 1 月 1 日是周四（ getDay() === 4 ）或闰年且是周三（ getDay() === 3 ），则该年有 53 周，否则 52 周。
 */
export function getWeeksInYear(year: number): number {
  const jan1 = new Date(year, 0, 1) // 1 月 1 日
  const day = jan1.getDay() // Jan 1 是周四（ getDay() === 4 ）→ 53 周，否则 52 周
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 // 闰年判断，闰年 29 天，否则 28 天
  return day === 4 || (isLeap && day === 3) ? 53 : 52 // 如果 1 月 1 日是周四（ getDay() === 4 ）或闰年且是周三（ getDay() === 3 ），则该年有 53 周，否则 52 周
}

/**
 * @deprecated 根据年份和 ISO 周数计算该周的开始日期（周一）和结束日期（周日），遵循 ISO 8601 标准：周一是一周的第一天。
 * @param {number} year 年份 (例如: 2025)
 * @param {number} week 周数 (例如: 42)
 * @returns 包含开始日期和结束日期的范围，格式为 { start: 'yyyy-MM-dd', end: 'yyyy-MM-dd' }
 */
export function getDateRangeOfWeek(year: number, week: number): { start: string; end: string } {
  // 创建一个日期对象，设置为该年份的 1 月 1 日
  const d: Date = new Date(year, 0, 1)

  // 获取 1 月 1 日是星期几 (0=周日, 1=周一, ..., 6=周六)
  const dayOfWeek = d.getDay()

  // ISO 8601 标准要求第一周包含 1 月 4 日。
  // 计算需要偏移多少天才能到达第一周的周一。
  // 如果 1 月 1 日是周五、周六或周日，则第一周实际上是下一周。
  let dayOffset = dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek

  // 将日期设置为当年第一周的周一
  d.setDate(d.getDate() + dayOffset)

  // 将日期前进到目标周数
  // 我们已经定位在第 1 周的开始，所以只需要加上 (week - 1) * 7 天
  d.setDate(d.getDate() + (week - 1) * 7)

  // d 现在是目标周的周一 (开始日期)
  const start: Date = new Date(d)

  // 结束日期是开始日期 + 6 天 (周日)
  const end: Date = new Date(start)

  end.setDate(end.getDate() + 6)

  return {
    start: _utils.formatDate(start.getTime(), 'yyyy-MM-dd'),
    end: _utils.formatDate(end.getTime(), 'yyyy-MM-dd')
  }
}

/**
 * @description 获取指定日期所在年份的周数
 * @param {number} year 年份 (例如: 2025)
 * @param {Date} date 日期对象 (例如: new Date())
 * @returns 周数 (例如: 42)
 */
export function getCurrentWeekInYear(year: number, date: Date = new Date()): number {
  const jan1 = new Date(year, 0, 1)
  const dayOfWeek = jan1.getDay()
  const dayOffset = dayOfWeek <= 4 ? 1 - dayOfWeek : 8 - dayOfWeek
  const firstMonday = new Date(jan1)
  firstMonday.setDate(firstMonday.getDate() + dayOffset)
  const d = new Date(date)
  const dw = d.getDay()
  const diffToMonday = (dw === 0 ? -6 : 1) - dw
  const currentMonday = new Date(d)
  currentMonday.setDate(currentMonday.getDate() + diffToMonday)
  let diffDays = Math.floor((currentMonday.getTime() - firstMonday.getTime()) / 86400000)
  let weekNum = diffDays < 0 ? 1 : Math.floor(diffDays / 7) + 1
  const maxWeeks = getWeeksInYear(year)
  if (weekNum > maxWeeks) weekNum = maxWeeks
  return weekNum
}
