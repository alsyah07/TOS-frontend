const slugify = function(title) {
  var slug = "";
  // Change to lower case
  var titleLower = title.toLowerCase();
  // Letter "e"
  slug = titleLower.replace(/e|é|è|ẽ|ẻ|ẹ|ê|ế|ề|ễ|ể|ệ/gi, "e");
  // Letter "a"
  slug = slug.replace(/a|á|à|ã|ả|ạ|ă|ắ|ằ|ẵ|ẳ|ặ|â|ấ|ầ|ẫ|ẩ|ậ/gi, "a");
  // Letter "o"
  slug = slug.replace(/o|ó|ò|õ|ỏ|ọ|ô|ố|ồ|ỗ|ổ|ộ|ơ|ớ|ờ|ỡ|ở|ợ/gi, "o");
  // Letter "u"
  slug = slug.replace(/u|ú|ù|ũ|ủ|ụ|ư|ứ|ừ|ữ|ử|ự/gi, "u");
  // Letter "d"
  slug = slug.replace(/đ/gi, "d");
  // Trim the last whitespace
  slug = slug.replace(/\s*$/g, "");
  // Change whitespace to "-"
  slug = slug.replace(/\s+/g, "-");
  slug = slug.replace(/[^a-zA-Z0-9-._]+/gi, "");
  return slug;
};

const assetURl = process.env.VUE_APP_BASE_URL;

const asset = function(path) {
  return assetURl + path;
};

const listLevel = [
  { value: "kelurahan", text: "Kelurahan" },
  { value: "kecamatan", text: "Kecamatan" },
  { value: "kota", text: "Kota" },
  { value: "provinsi", text: "Provinsi" },
  { value: "dinas", text: "Dinas" },
  { value: "sudin", text: "Suku Dinas" },
  { value: "bumd", text: "BUMD" },
];

const listSentiment = [
  {
    slug: "positive",
    name: "Positif",
    color: "success",
    icon: "flaticon2-plus",
  },
  {
    slug: "negative",
    name: "Negatif",
    color: "warning",
    icon: "flaticon2-line",
  },
  {
    slug: "neutral",
    name: "Netral",
    color: "primary",
    icon: "flaticon2-zig-zag-line-sign",
  },
  {
    slug: "closed",
    name: "Tertutup",
    color: "error",
    icon: "flaticon2-delete",
  },
];

export { slugify, assetURl, asset, listLevel, listSentiment };
