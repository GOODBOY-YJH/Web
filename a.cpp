#include <stdio.h>
#include <ctype.h>
#include <stdlib.h>
#include <math.h>

#define firstdayof1 1
/* define the first day of first year. 星期日=7 */
#define gap "    "
/* set gap between numbers of dates */
#define dent "                    "
/* set right margin. */

struct info
{
    int month;
    int firstdayofmonth;
    int daysofmonth;
    int leap;
} monthinfo;

int checkinput(void);
int inputyear(void);
int isleap(int y);
void output(struct info);
void printhead(struct info);
void printmonth(struct info);
struct info setinit(int);
struct info setmonthinfo(struct info);

/* This fuction is to accept year, if it is leap year, it return 1, otherwise 
   return 0                                           */

int isleap(int y)
{
    return ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0);
}

/* This module is to accept inputyear() and check if it is correct. if it is
   correct it return int year, otherwise ask user reenter                */

int checkinput(void)
{
    int y;
    do
    {
        y = inputyear();
        if (y < 1 || y > 3000)
        {
            printf("\n输入错误！。\n\n");
            y = 0;
        }
    } while (y < 1);
    return y;
}

/* This function is to accept the input year, if it is the integer, it returns
 it, otherwise it return -1                                                  */

int inputyear(void)
{
    char s[80];
    int i, y;
    y = -1;
    printf("请输入年份(1-3000):");
    for (i = 0; i < 80; ++i)
    {
        s[i] = getchar();
        if (s[i] == 27)
            exit(0);
        if (s[i] == 10)
            break;
    }
    for (i = 0; i < 80; ++i)
    {
        if (s[i] == 10)
            break;
        else if (!isdigit(s[i]))
            return y;
    }
    y = atoi(s);
    return y;
}

/*This module is to accept monthinfo, and print the whole year calender.   */

void output(struct info monthinfo)
{
    char ch;
    do
    {
        printhead(monthinfo);
        printmonth(monthinfo);
        printf("按任意键显视下一月, 按Esc键退出. \n");
        ch = getchar();
        if (ch == 27)
            exit(0);
        monthinfo = setmonthinfo(monthinfo);
    } while (monthinfo.month < 13);
}

/* This module is to accept monthinfo, amd print monthly head like"一  月"   */

void printhead(struct info monthinfo)
{
    char *ss;
    printf("%s", dent);
    switch (monthinfo.month)
    {
    case 1:
        ss = "一  月";
        break;
    case 2:
        ss = "二  月";
        break;
    case 3:
        ss = "三  月";
        break;
    case 4:
        ss = "四  月";
        break;
    case 5:
        ss = "五  月";
        break;
    case 6:
        ss = "六  月";
        break;
    case 7:
        ss = "七  月";
        break;
    case 8:
        ss = "八  月";
        break;
    case 9:
        ss = "九  月";
        break;
    case 10:
        ss = "十  月";
        break;
    case 11:
        ss = "十一  月";
        break;
    case 12:
        ss = "十二  月";
    }
    printf("    %s%s%s%s\n\n", gap, gap, gap, ss);
}

/* This module is to accept monthinfo, and print the numbered dates of the 
    month.                                                                */

void printmonth(struct info monthinfo)
{
    int i, j, k;
    printf("%s", dent);
    printf("一%s二%s三%s四%s五%s六%s日\n\n", gap, gap, gap, gap, gap, gap);
    printf("%s", dent);
    for (i = 1; i < monthinfo.firstdayofmonth; i = i + 1)
    {
        printf("%s  ", gap);
    }
    k = monthinfo.firstdayofmonth;
    for (j = 1; j <= monthinfo.daysofmonth; j = j + 1)
    {
        if (k > 7)
        {
            k = k - 7;
            printf("\n\n%s", dent);
        };
        k = k + 1;
        printf("%2d%s", j, gap);
    }
    printf("\n\n");
}

/* This module is to accept the monthinfo, and set the monthinfo of next month.
                                         */
struct info setmonthinfo(struct info monthinfo)
{
    int m;
    monthinfo.firstdayofmonth = (monthinfo.firstdayofmonth + monthinfo.daysofmonth - 1) % 7 + 1;
    monthinfo.month = monthinfo.month + 1;
    monthinfo.daysofmonth = 30;
    m = monthinfo.month;
    if (m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12)
        monthinfo.daysofmonth = 31;
    if (m == 2)
    {
        if (monthinfo.leap)
            monthinfo.daysofmonth = 29;
        else
            monthinfo.daysofmonth = 28;
    }
    return monthinfo;
}

/* This module is to initialize the monthinfo. */
struct info setinit(int year)
{
    int i, days, total;
    struct info monthinfo;
    monthinfo.month = 1;
    monthinfo.firstdayofmonth = firstdayof1;
    for (i = 1; i < year; i = i + 1)
    {
        if (isleap(i))
            days = 366;
        else
            days = 365;
        monthinfo.firstdayofmonth = (monthinfo.firstdayofmonth + days - 1) % 7 + 1;
    }
    monthinfo.daysofmonth = 31;
    monthinfo.leap = isleap(year);
    return monthinfo;
}

int main()
{
    int year;
    struct info monthinfo;

    year = checkinput();
    monthinfo = setinit(year);
    output(monthinfo);
    return 0;
}
