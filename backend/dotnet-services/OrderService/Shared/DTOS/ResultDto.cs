using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.DTOS
{
    public class ResultDto<T>
    {
        public bool IsSuccess { get; init; }
        public string? Error { get; init; }
        public T? Value { get; init; }

        public static ResultDto<T> Success(T value) => new() { IsSuccess = true, Value = value };
        public static ResultDto<T> Failure(string error) => new() { IsSuccess = false, Error = error };
    }
}
