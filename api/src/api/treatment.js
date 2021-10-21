import {Treatment} from "../models.js";
import {getPagination, getPagingData} from "../utils.js";

const retrieve = async (req, res) => {
    const data = await Treatment.findByPk(req.params.id);
    if (data === null) {
        return res.status(404).json({});
    }

    return res.status(200).json(data.toJSON());
}

const list = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    const data = await Treatment.findAndCountAll({
         limit, offset, order: ['createdAt'],
    });

    return res.status(200).send(getPagingData(data, page, limit));
}


export default {
    retrieve,
    list,
}
