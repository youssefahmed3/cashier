using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Shared.DTOS;
using Shift.Core.Entities;
using Shift.Core.Interfaces.Repositories;
using Shift.Core.Interfaces.Services;
using Shift.Core.Enums;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Shift.Services.Services
{
    public class ShiftService : IShiftService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public ShiftService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<ResultDto<ShiftDto>> StartShiftAsync(StartShiftDto request)
        {
            try
            {
                var activeShift = await _unitOfWork.ShiftRepository.GetActiveShiftAsync(request.BranchId, request.UserId);
                if (activeShift != null)
                    return ResultDto<ShiftDto>.Failure("There is already an active shift for this User in that branch.");

               await _unitOfWork.BeginTransactionAsync();
                var shift = new Core.Entities.Shift
                {
                    UserId = request.UserId,
                    BranchId = request.BranchId,
                    StartingCash = request.StartingCash,
                    StartTime = DateTime.UtcNow,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                };

                await _unitOfWork.ShiftRepository.AddAsync(shift);
                await _unitOfWork.SaveChangesAsync();


                var openingLog = new DrawerLog()
                {
                    Amount = request.StartingCash,
                    TransactionType = TransactionType.Opening,
                    BranchId = request.BranchId,
                    ShiftId = shift.Id,
                    Reference = $"Shift opened for # {request.UserId} ",
                    CreatedAt = DateTime.UtcNow,
                };
                
                await _unitOfWork.DrawerLogRepository.AddAsync(openingLog);
                await _unitOfWork.SaveChangesAsync();
                await _unitOfWork.CommitTransactionAsync();

                var shiftDto =  _mapper.Map<ShiftDto>(shift);

                return ResultDto<ShiftDto>.Success(shiftDto);

            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResultDto<ShiftDto>.Failure($"Failed to start shift: {ex.Message}");

            }

        }

        public async Task<ResultDto<ShiftDto>> EndShiftAsync(EndShiftDto request)
        {
            try
            {
                var activeShift = await _unitOfWork.ShiftRepository.GetShiftWithDrawerLogsAsync(request.ShiftId);
                if (activeShift == null || !activeShift.IsActive)
                    return ResultDto<ShiftDto>.Failure("There is no active shift to close.");

                await _unitOfWork.BeginTransactionAsync();

                activeShift.EndingCash = request.EndingCash;
                activeShift.EndTime =  DateTime.UtcNow;
                activeShift.ExpectedCash = activeShift.StartingCash + GetExpectedCash(activeShift);
                activeShift.CashDifference = request.EndingCash - activeShift.ExpectedCash;
                activeShift.IsActive = false;

                //TODO Check for Fraud and tell the Admin via notification
                _unitOfWork.ShiftRepository.Update(activeShift);

                var closingLog = new DrawerLog()
                {
                    Amount = request.EndingCash,
                    TransactionType = TransactionType.Closing,
                    BranchId = activeShift.BranchId,
                    ShiftId = activeShift.Id,
                    Reference = $"Shift closed # {activeShift.UserId} ",
                    CreatedAt = DateTime.UtcNow,
                };


                await _unitOfWork.DrawerLogRepository.AddAsync(closingLog);
                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitTransactionAsync();

                var shiftDto = _mapper.Map<ShiftDto>(activeShift);

                return ResultDto<ShiftDto>.Success(shiftDto);

            }
            catch (Exception ex)
            {
                await _unitOfWork.RollbackTransactionAsync();
                return ResultDto<ShiftDto>.Failure($"Failed to end shift: {ex.Message}");

            }

        }

        public async Task<ResultDto<ShiftDto>> GetActiveShiftAsync(long branchId, long userId)
        {
            try
            {
                var activeShift = await _unitOfWork.ShiftRepository.GetActiveShiftAsync(branchId, userId);
                if (activeShift == null)
                    return ResultDto<ShiftDto>.Failure("No active shift found.");
                var shiftDto = _mapper.Map<ShiftDto>(activeShift);

                return ResultDto<ShiftDto>.Success(shiftDto);

            }
            catch (Exception ex) 
            {
                return ResultDto<ShiftDto>.Failure($"Error retrieving active shift: {ex.Message}");
            }

        }
        public async Task<ResultDto<ShiftDto>> GetShiftByIdAsync(long shiftId)
        {
            try
            {
                var shift = await _unitOfWork.ShiftRepository.GetShiftWithDrawerLogsAsync(shiftId);
                if (shift == null)
                    return ResultDto<ShiftDto>.Failure("Shift not found.");
                var shiftDto = _mapper.Map<ShiftDto>(shift);

                return ResultDto<ShiftDto>.Success(shiftDto);

            }
            catch (Exception ex)
            {
                return ResultDto<ShiftDto>.Failure($"Error retrieving shift: {ex.Message}");
            }

        }

        public async Task<ResultDto<IEnumerable<ShiftDto>>> GetShiftsByBranchAsync(long branchId, DateTime? fromDate = null, DateTime? toDate = null)
        {
            try
            {
                var shifts = await _unitOfWork.ShiftRepository.GetShiftsByBranchAsync(branchId, fromDate, toDate);
                var shiftDtos = _mapper.Map<IEnumerable<ShiftDto>>(shifts);
                return ResultDto<IEnumerable<ShiftDto>>.Success(shiftDtos);
            }
            catch (Exception ex)
            {
                return ResultDto<IEnumerable<ShiftDto>>.Failure($"Error retrieving shifts: {ex.Message}");
            }
        }

        public async Task<ResultDto<bool>> AddDrawerLogAsync(DrawerLogDto log)
        {
            try
            {
                var activeShift = await _unitOfWork.ShiftRepository.GetByIdAsync(log.ShiftId);
                if (activeShift == null || !activeShift.IsActive)
                    return ResultDto<bool>.Failure("Shift not found.");
                var drawerLog = _mapper.Map<DrawerLog>(log);
                await _unitOfWork.DrawerLogRepository.AddAsync(drawerLog);
                await _unitOfWork.SaveChangesAsync();

                return ResultDto<bool>.Success(true);
            }
            catch (Exception ex)
            {
                return ResultDto<bool>.Failure($"Error adding drawer log: {ex.Message}");
            }

        }

        public async Task<ResultDto<IEnumerable<DrawerLogDto>>> GetDrawerLogsByShiftAsync(long shiftId)
        {
            try
            {
                var drawerLogs = await _unitOfWork.DrawerLogRepository.GetDrawerLogsByShiftAsync(shiftId);
                var drawerLogDtos = _mapper.Map<IEnumerable<DrawerLogDto>>(drawerLogs);
                return ResultDto<IEnumerable<DrawerLogDto>>.Success(drawerLogDtos);
            }
            catch (Exception ex)
            {
                return ResultDto<IEnumerable<DrawerLogDto>>.Failure($"Error retrieving drawer logs: {ex.Message}");
            }
        }

        private decimal GetExpectedCash(Core.Entities.Shift shift)
        {
            if (shift?.DrawerLogs == null)
                return 0;

            var salesTotal = shift.DrawerLogs
                                  .Where(d => d.TransactionType == TransactionType.Sale)
                                  .Sum(d => d.Amount);

            var refundTotal = shift.DrawerLogs
                                   .Where(d => d.TransactionType == TransactionType.Refund)
                                   .Sum(d => Math.Abs(d.Amount));

            var expectedCash = salesTotal - refundTotal;

            return expectedCash;
        }

    }
}
