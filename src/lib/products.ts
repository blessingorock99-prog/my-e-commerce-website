const isObject = (value: any) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

const looksLikeProduct = (value: any) =>
  isObject(value) && (
    value.name ||
    value.title ||
    value.price !== undefined ||
    value.stock !== undefined ||
    value.quantity !== undefined ||
    value.image ||
    value.imageUrl ||
    value.imageURLs
  )

const pickFirst = (...values: any[]) =>
  values.find(value => value !== undefined && value !== null && value !== '')

export const extractList = (data: any): any[] => {
  if (Array.isArray(data)) return data

  const direct =
    data?.products ||
    data?.product ||
    data?.items ||
    data?.docs ||
    data?.results ||
    data?.result ||
    data?.data?.products ||
    data?.data?.items ||
    data?.data?.docs ||
    data?.data?.results ||
    data?.data?.result

  if (Array.isArray(direct)) return direct

  const seen = new Set<any>()
  const findArray = (value: any, depth = 0): any[] => {
    if (!value || depth > 4 || seen.has(value)) return []
    if (Array.isArray(value)) return value
    if (!isObject(value)) return []
    seen.add(value)

    for (const key of ['products', 'items', 'docs', 'results', 'result', 'data', 'payload', 'list']) {
      const found = findArray(value[key], depth + 1)
      if (found.length) return found
    }

    for (const nested of Object.values(value)) {
      const found = findArray(nested, depth + 1)
      if (found.length) return found
    }

    return []
  }

  return findArray(data)
}

export const unwrapProduct = (data: any): any => {
  if (looksLikeProduct(data)) return data

  const candidates = [
    data?.product,
    data?.productData,
    data?.item,
    data?.data?.product,
    data?.data?.productData,
    data?.data?.item,
    data?.data?.result,
    data?.result,
    data?.data,
  ]

  for (const candidate of candidates) {
    if (looksLikeProduct(candidate)) return candidate
  }

  return candidates.find(Boolean) || data
}

export const getProductId = (product: any) =>
  String(product?._id || product?.id || product?.productId?._id || product?.productId || product?.slug || '')

export const getProductName = (product: any) =>
  pickFirst(product?.name, product?.title, product?.productName, 'Product')

export const getProductDescription = (product: any) =>
  pickFirst(product?.description, product?.desc, product?.details, product?.shortDescription, '')

export const getProductPrice = (product: any) =>
  pickFirst(product?.price, product?.salePrice, product?.amount, product?.unitPrice, 0)

export const getProductOldPrice = (product: any) =>
  pickFirst(product?.old, product?.oldPrice, product?.compareAtPrice, product?.regularPrice, null)

const imageFromValue = (value: any): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(imageFromValue).find(Boolean) || ''
  return value.url || value.src || value.secure_url || value.path || value.location || ''
}

export const getProductImage = (product: any) => {
  return imageFromValue(
    product?.imageURLs ||
    product?.imageUrls ||
    product?.images ||
    product?.imageUrl ||
    product?.imageURL ||
    product?.mainImage ||
    product?.coverImage ||
    product?.thumbnail ||
    product?.photo ||
    product?.picture ||
    product?.image ||
    product?.img
  )
}

export const getProductCategory = (product: any) =>
  product?.category?.name || product?.category || product?.cat || product?.type || ''

export const getProductVariants = (product: any) => {
  const variants = product?.variants || product?.sizes || product?.size || product?.colors || product?.color
  if (Array.isArray(variants) && variants.length > 0) return variants
  if (variants) return [variants]
  return ['Default']
}

export const getProductStock = (product: any) =>
  Number(pickFirst(product?.stock, product?.quantity, product?.qty, product?.countInStock, product?.availableQuantity, product?.totalStock, 0))

export const normalizeWishlistItems = (data: any) => {
  const root = data?.wishlist || data?.wishList || data?.data || data
  const items = Array.isArray(root)
    ? root
    : root?.items || root?.products || root?.wishlist || root?.wishList || []

  return items
    .map((item: any) => item?.product || item?.productId || item?.item || item)
    .filter(Boolean)
}
