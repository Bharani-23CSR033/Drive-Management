const addJsonTransform = (schema, mapDoc = () => {}) => {
  schema.set("toJSON", {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id?.toString?.() || ret._id;
      delete ret.__v;
      mapDoc(ret);
      return ret;
    },
  });
};

module.exports = addJsonTransform;