import moment from 'moment';

const DescendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
};

const Comparator = (order, orderBy) => {
    return order === "desc"
        ? (a, b) => DescendingComparator(a, b, orderBy)
        : (a, b) => -DescendingComparator(a, b, orderBy);
};

const Sort = (array, comparator) => {
    console.log(
        `%c
      ${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} \r\n
      const Sort = (array, comparator) \r\n
      array -> ${JSON.stringify(array)} \r\n
      `
        ,
        'color: red; background-color: yellow; font-size: larger'
    );

    const stabilizedThis = array.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);

        if (order !== 0) {
            return order;
        }

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
};

export {
    DescendingComparator,
    Comparator,
    Sort,
};