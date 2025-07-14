using Microsoft.EntityFrameworkCore;

namespace auditlog_backend.Helper
{
    public static class HelperMapper
    {
        public static TDestination Map<TSource, TDestination>(TSource source) where TDestination : new()
        {
            if (source == null) return default;

            var destination = new TDestination();
            var sourceProps = typeof(TSource).GetProperties();
            var destProps = typeof(TDestination).GetProperties();

            foreach (var sourceProp in sourceProps)
            {
                var destProp = destProps.FirstOrDefault(dp => dp.Name == sourceProp.Name && dp.PropertyType == sourceProp.PropertyType);
                if (destProp != null && destProp.CanWrite)
                {
                    var value = sourceProp.GetValue(source);
                    destProp.SetValue(destination, value);
                }
            }

            return destination;
        }

        public static void MapToExisting<TSource, TDestination>(TSource source, TDestination destination)
        {
            if (source == null || destination == null) return;

            var sourceProperties = typeof(TSource).GetProperties();
            var destinationProperties = typeof(TDestination).GetProperties();

            foreach (var destProp in destinationProperties)
            {
                if (!destProp.CanWrite)
                    continue;

                var sourceProp = sourceProperties.FirstOrDefault(sp => sp.Name == destProp.Name
                    && sp.PropertyType == destProp.PropertyType);

                if (sourceProp != null)
                {
                    var value = sourceProp.GetValue(source);
                    destProp.SetValue(destination, value);
                }
            }
        }

    }

    public static class QueryableExtensions
    {
        public static async Task<PagedResult<TDto>> ToPagedResultAsync<TEntity, TDto>(
            this IQueryable<TEntity> query,
            int page,
            int pageSize,
            Func<TEntity, TDto> mapper)
        {
            var totalRecord = await query.CountAsync();
            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var mappedItems = items.Select(mapper).ToList();

            return new PagedResult<TDto>
            {
                TotalRecord = totalRecord,
                CurrentPage = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalRecord / pageSize),
                Items = mappedItems
            };
        }
    }

    public class PagedResult<T>
    {
        public int TotalRecord { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public List<T> Items { get; set; }
    }

    public class Consts
    {
        public const string DefaultAvatarUrl = "https://e7.pngegg.com/pngimages/84/165/png-clipart-united-states-avatar-organization-information-user-avatar-service-computer-wallpaper-thumbnail.png";
    }
}
