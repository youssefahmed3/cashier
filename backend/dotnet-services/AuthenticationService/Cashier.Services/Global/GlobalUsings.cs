global using AutoMapper;
global using Cashier.Core.Entities;
global using Cashier.Core.Interfaces.Services;
global using Cashier.Shared.DTOS;
global using Microsoft.AspNetCore.Identity;
global using Microsoft.Extensions.Options;
global using Microsoft.IdentityModel.Tokens;
global using System.IdentityModel.Tokens.Jwt;
global using System.Security.Claims;
global using System.Text;
global using Cashier.Services.Helpers.EmailService;
global using MailKit.Net.Smtp;
global using MailKit.Security;
global using Microsoft.Extensions.Configuration;
global using MimeKit;
global using Microsoft.Extensions.Caching.Memory;
global using Cashier.Services.Helpers.EmailBuilderService;

