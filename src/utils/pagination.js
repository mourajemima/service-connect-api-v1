function getPagination(page, limit) {
    const currentPage = parseInt(page) || 1;
    const maxLimit = 50;
    let pageLimit = parseInt(limit) || 10;
    if(pageLimit > maxLimit) pageLimit = maxLimit;
    const offset = (currentPage - 1) * pageLimit;
    return {
        page: currentPage,
        limit: pageLimit,
        offset
    };
}

function getPagingData(data, page, limit) {
    const { count, rows } = data;
    const totalPages = Math.ceil(count / limit);
    return {
        total: count,
        page,
        limit,
        totalPages,
        items: rows
    };
}

module.exports = {
    getPagination,
    getPagingData
};