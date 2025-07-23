using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shift.Services.Helpers
{
    public class EnumHelper
    {
        public static bool TryParseEnum<TEnum>(string? value, out TEnum valueEnum) where TEnum : struct, Enum
        {
            if (!string.IsNullOrWhiteSpace(value) &&
                Enum.TryParse(value, ignoreCase: true, out TEnum parsed) &&
                Enum.IsDefined(typeof(TEnum), parsed))
            {
                valueEnum = parsed;
                return true;
            }

            valueEnum = default;
            return false;
        }

        public static TEnum ConvertToEnum<TEnum>(string? value, TEnum defaultValue) where TEnum : struct, Enum
        {
            if (TryParseEnum(value, out TEnum result))
            {
                return result;
            }
            return defaultValue;
        }

    }
}
