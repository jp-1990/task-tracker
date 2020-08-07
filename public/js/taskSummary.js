/* eslint-disable */
import { DOMStrings } from './domStrings';

// FUNCTIONS //
// unique group names
const getUniqueGroups = (stats, task) => {
  if (
    !stats.find((obj) => {
      return obj.group === task.group;
    })
  ) {
    stats.push({ group: task.group, totalDuration: 0, tasks: [] });
  }
};

// unique task titles
const getUniqueTaskTitles = (stats, task) => {
  stats.forEach((el) => {
    if (
      el.group === task.group &&
      !el.tasks.find((obj) => {
        return obj.title === task.title;
      })
    ) {
      el.tasks.push({
        title: task.title,
        colour: task.colour,
        totalDuration: 0,
      });
    }
  });
};

// add the total duration of each task title to the stats array objects and group
const getTotalTaskAndGroupDuration = (stats, task) => {
  // get index of group in stats array
  const groupIndex = stats.findIndex((obj) => {
    return obj.group === task.group;
  });
  // get index of task in tasks property of group object
  const titleIndex = stats[groupIndex].tasks.findIndex((obj) => {
    return obj.title === task.title;
  });

  // add duration to stats array objects and main group
  const duration = new Date(task.end) - new Date(task.start);
  if (titleIndex !== -1 && groupIndex !== -1) {
    stats[groupIndex].totalDuration += duration / 1000 / 60;
    stats[groupIndex].tasks[titleIndex].totalDuration += duration / 1000 / 60;
  }
};

// minutes in month based on days in selected month
const calcMinutesInMonth = (monthYear) => {
  const daysInMonth = new Date(monthYear.year, monthYear.month + 1, 0);
  return daysInMonth.getDate() * 24 * 60;
};

// weeks in month based on days in selected month
const calcWeeksInMonth = (monthYear) => {
  const daysInMonth = new Date(monthYear.year, monthYear.month + 1, 0);
  return daysInMonth.getDate() / 7;
};

// total duration as a percentage of the month
const calcPercentageOfMonth = (item, monthYear) => {
  item.percentageOfMonth =
    (item.totalDuration / calcMinutesInMonth(monthYear)) * 100;
};

// total duration as an average per week
const calcAveragePerWeek = (item, monthYear) => {
  const daysInMonth = new Date(
    monthYear.year,
    monthYear.month + 1,
    0
  ).getDate();

  // if selected month has not yet finished
  if (Date.now() < new Date(monthYear.year, monthYear.month, daysInMonth, 24)) {
    item.averagePerWeek =
      item.totalDuration / (new Date(Date.now()).getDate() / 7);
  } else {
    item.averagePerWeek = item.totalDuration / calcWeeksInMonth(monthYear);
  }
};

// display in DOM
const displaySummary = (markup) => {
  DOMStrings.summary.insertAdjacentHTML('afterbegin', markup);
};

// convert minutes to hours and minutes
const simplifyMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0 && mins > 0) {
    return `${hours} hours ${mins} mins`;
  } else if (hours > 0) {
    return `${hours} hours`;
  } else {
    return `${mins} mins`;
  }
};

// create markup for the summary based on stats array
const summaryMarkup = (statsArray) => {
  const markup = [];
  if (!statsArray.length > 0) {
    markup.push(`
      <div class="task__summary__container">
        <div class="task__summary__titlebox">
          <h3>Summary</h3>
          <ion-icon name="close"></ion-icon>
        </div>
        <div class="task__summary--null">
          <h3>[ No data for this month ]</h3>
        </div>
      </div>
  `);
  } else {
    markup.push(`
    <div class="task__summary__container">
      <div class="task__summary__titlebox">
        <h3>Summary</h3>
        <ion-icon name="close"></ion-icon>
      </div>
    `);

    statsArray.forEach((el) => {
      markup.push(`
        <div class="task__summary__group">
          <div class="task__summary--group-stats">
            <h2>${el.group ? el.group : 'Other'}</h2>
            <div class="task__summary--group-values">
              <ul>
                <li>This month: ${simplifyMinutes(el.totalDuration)}</li>
                <li>Percentage of month: ${el.percentageOfMonth.toFixed(
                  2
                )}%</li>
                <li>Different tasks: ${el.tasks.length}</li>
                <li>Average per week: ${simplifyMinutes(el.averagePerWeek)}</li>
              </ul>
            </div>
          </div>
          <div class="task__summary__tasks">
      `);
      el.tasks.forEach((e) => {
        markup.push(`
            <div class="task__summary--task-stats">
              <div class="task__summary--task-titlebox">
                <div class="task__summary--task-colour" style="background-color:${
                  e.colour
                }"></div>
                <h3>${e.title}</h3>
              </div>
              <div class="task__summary--task-values">
                <ul>
                  <li>This month: ${simplifyMinutes(e.totalDuration)}</li>
                  <li>Percentage of month: ${e.percentageOfMonth.toFixed(
                    2
                  )}%</li>
                  <li>Average per week: ${simplifyMinutes(
                    e.averagePerWeek
                  )}</li>
                </ul>
              </div>
            </div>
        `);
      });

      markup.push(`</div></div>`);
    });
    markup.push(`</div>`);
  }
  return markup.join('');
};

// keys markup
const keyMarkup = (key) => {
  const markup = [];
  markup.push(`<div class="task__key--container">`);
  key.forEach((el) => {
    el.tasks.forEach((e) => {
      markup.push(`
        <div class="task__key--key ${e.title}--key">
          <div class="task__key--colour" style="background-color:${e.colour}"></div>
          <div class="task__key--title"><h3>${e.title}</h3></div>
        </div>
      `);
    });
  });
  markup.push(`</div>`);
  return markup.join('');
};

// display key in DOM
const displayKey = (markup) => {
  document.querySelector('.task__key').insertAdjacentHTML('afterbegin', markup);
};

// remove existing summary
const removeSummary = () => {
  if (document.querySelector('.task__summary__container')) {
    DOMStrings.summary.removeChild(
      document.querySelector('.task__summary__container')
    );
  }
};

// remove existing key
const removeKey = () => {
  if (document.querySelector('.task__key--container')) {
    document
      .querySelector('.task__key')
      .removeChild(document.querySelector('.task__key--container'));
  }
};

// close summary on 'X' click
const closeSummary = () => {
  DOMStrings.summary.addEventListener('click', (el) => {
    if (
      el.target ===
      document.querySelector(
        '.task__summary__titlebox > ion-icon[name="close"]'
      )
    ) {
      removeSummary();
      DOMStrings.summary.classList.toggle('hide');
    }
  });
};

// on click toggle create/delete summary
const summaryButtonListener = (monthYear, tasks) => {
  // ensure summary begins hidden
  DOMStrings.summary.classList.remove('hide');
  DOMStrings.summary.classList.add('hide');

  // create/delete on button click
  DOMStrings.summaryButton.addEventListener('click', (el) => {
    if (document.querySelector('.task__summary__container')) {
      DOMStrings.summary.classList.toggle('hide');
      removeSummary();
    } else {
      DOMStrings.summary.classList.toggle('hide');
      taskSummary(monthYear, tasks);
    }
  });
};

// EXPORTS //
// summary of tasks for month
export const taskSummary = (monthYearFunc, tasks) => {
  const monthYear = monthYearFunc();
  // clear summary
  removeSummary();

  let stats = [];
  // populate the stats array based on the month and year
  tasks.forEach((el) => {
    const month = new Date(el.start).getMonth();
    const year = new Date(el.start).getFullYear();

    if (month === monthYear.month && year === monthYear.year) {
      // get unique group names
      getUniqueGroups(stats, el);
      // get unique task titles
      getUniqueTaskTitles(stats, el);
      // get total duration of each task and group
      getTotalTaskAndGroupDuration(stats, el);
    }
  });

  // add percentage of month and average per week to tasks and groups
  stats.forEach((el) => {
    calcPercentageOfMonth(el, monthYear);
    calcAveragePerWeek(el, monthYear);

    el.tasks.forEach((e) => {
      calcPercentageOfMonth(e, monthYear);
      calcAveragePerWeek(e, monthYear);
    });
  });

  // create and display markup
  displaySummary(summaryMarkup(stats));
};

// add event listener to display summary on button click
export const createSummaryListeners = (monthYearFunc, tasks) => {
  // toggle between create and delete on click
  summaryButtonListener(monthYearFunc, tasks);
  // close on 'X' click
  closeSummary();
};

// task key
export const createTaskKey = (monthYearFunc, tasks) => {
  const monthYear = monthYearFunc();
  let key = [];

  removeKey();

  tasks.forEach((el) => {
    const month = new Date(el.start).getMonth();
    const year = new Date(el.start).getFullYear();

    if (month === monthYear.month && year === monthYear.year) {
      // get unique group names
      getUniqueGroups(key, el);
      // get unique task titles
      getUniqueTaskTitles(key, el);
    }
  });

  displayKey(keyMarkup(key));
};
