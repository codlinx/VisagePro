class FaceDelete {
  static async handler(req, res) {
    const { uuid } = req.body;
    const customerId = req.customer.id;

    if (!uuid)
      return res.status(400).json({
        error: true,
        message: "É preciso enviar um uuid para deletar.",
      });

    try {
      const items = await db.query(
        `
            DELETE FROM faces
            WHERE uuid = :uuid
            AND customerId = :customerId
            RETURNING *;
            `,
        {
          type: db.QueryTypes.DELETE,
          replacements: {
            uuid,
            customerId,
          },
        }
      );

      if (items.length === 0)
        return res.status(400).json({
          error: true,
          message: "Nenhuma face encontrada.",
        });

      return res.json({
        error: false,
        message: "Face deletada.",
        uuid: items[0].uuid,
      });
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = FaceDelete;
