import {Hospital} from "../models.js";
import {getPagination, getPagingData} from "../utils.js";


export const list = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await Hospital.findAndCountAll({
         limit, offset, order: ['createdAt'],
    });

    return res.status(200).send(getPagingData(data, page, limit));
}


export default {
    list,
}
