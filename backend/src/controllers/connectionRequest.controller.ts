import { Response } from "express";
import { asyncHandler } from "../config/asyncHandler";
import { IGetUserAuthInfoRequest } from "../Interfaces/user.interfaces";


/**
 * Connection Request apis
 * 1. GET connection request
 * 2 . GET connections
 * 3. POST interested
 * 4. POST ignored
 * 5. POST accepted
 * 6. POST rejected
 */

//  GET connection request
export  const fetchConnectionRequests = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {})


//  GET connections
export  const fetchConnections = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {})


//  POST interested
export  const sendInterestRequest = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {})


//  POST ignored
export  const ignoreConnectionRequest	 = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {})


//  POST accepted
export  const acceptConnectionRequest = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {})

//  POST rejected
export  const rejectConnectionRequest	 = asyncHandler<IGetUserAuthInfoRequest>(
  async (req, res: Response) => {})
