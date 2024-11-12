import { Button, Col, ConfigProvider, Input, InputNumber, Row, Select, Switch, Tag } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";
import './popup.css';
import { data } from "autoprefixer";
// import * as https from 'https';
// import { HttpsProxyAgent } from 'https-proxy-agent';
import './fonts.css';

const API_URL = 'https://api.netproxy.io/api/rotateProxy';
interface IInfo {
	proxy: string;
	refreshAt: string;
	nextChange: number;
	acceptIp: string;
	isResidential: boolean;
	country: string;
	username: string;
	password: string
}


// Thêm import font
import './fonts.css';

// Định nghĩa theme colors
const theme = {
	primary: '#2563EB', // Modern blue
	success: '#16A34A', // Professional green
	danger: '#DC2626',  // Refined red
	warning: '#F59E0B', // Warm orange
	text: {
		primary: '#1F2937',
		secondary: '#6B7280',
	},
	background: {
		light: '#F9FAFB',
		white: '#FFFFFF',
	}
};

const Popup = () => {
	const [locations, setLocations] = useState<string[]>([]);
	const [apiKey, setApiKey] = useState<string | null>('');
	const [seconds, setSeconds] = useState<number | null>(60);
	const [loading, setLoading] = useState<boolean>(false);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [location, setLocation] = useState<string>('all');
	const [type, setType] = useState<string>('all');
	const [error, setError] = useState<string | null>(null);
	const [info, setInfo] = useState<IInfo>();
	const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(false);
	const [countDown, setCountDown] = useState<number>(0);
	const [timeRefresh, setTimeRefresh] = useState<number>(0);

	const handleFetchLocations = async () => {
		try {
			const response = await axios({
				method: 'GET',
				url: `${API_URL}/location`,
			})
			const data = response.data.data.countries || [];
			setLocations(data);
		} catch (error) {
			console.log(`error`, error);
		}
	};

	const handleFetchCurrentProxy = async () => {
		setLoading(true);
		const apiKey = localStorage.getItem('apiKey') || '';
		const isConnected = localStorage.getItem('isConnected') === 'true' ? true : false;
		try {
			if (!apiKey || !isConnected) {
				setError('Please input API Key');
				setLoading(false);
				setIsConnected(false);
				console.log(`error`, 'Please input API Key');
				return;
			}
			const response = await axios({
				method: 'GET',
				url: `${API_URL}/getCurrentProxy`,
				params: {
					apiKey,
				}
			});
			setInfo(response.data.data);
			setTimeRefresh(response.data.data.nextChange || 0);
			setIsConnected(true);
			chrome.storage.local.set({ apiKey: apiKey }, () => {
				console.log('API Key saved successfully:', apiKey);
			});
			return;
		} catch (error) {
			console.log(`error`, error);
			setError(error?.response?.data?.message || 'Có lỗi xảy ra');
			setIsConnected(false);
			setInfo(null);
			localStorage.removeItem('isConnected');
			localStorage.removeItem('proxy');
			chrome.runtime.sendMessage({
				type: 'proxy_disconnect',
			});
		} finally {
			setLoading(false);
		}
	}

	const handleRenewProxy = async () => {
		setLoading(true);
		try {
			const response = await axios({
				method: 'GET',
				url: `${API_URL}/getNewProxy`,
				params: {
					apiKey,
					country: location === 'all' ? undefined : location,
				}
			});
			setInfo(response.data.data);
			setTimeRefresh(response.data.data.nextChange || 0);
			setIsConnected(true);
			if (response.data.success === false && response.data.message.includes('You can get new proxy in')) {
				setError(response.data.message);
				localStorage.setItem('apiKey', apiKey);
				localStorage.setItem('location', location || 'all');
				localStorage.setItem('isConnected', 'true');
				chrome.runtime.sendMessage({
					type: 'proxy_connect',
					data: {
						...response.data.data,
						newTab: response?.data?.message?.includes('You can get new proxy in') ? false : true
					}
				});
				chrome.storage.local.set({ apiKey: apiKey }, () => {
					console.log('API Key saved successfully:', apiKey);
				});
				return;
			}
			chrome.runtime.sendMessage({
				type: 'proxy_connect',
				data: {
					...response.data.data,
					newTab: response?.data?.message?.includes('You can get new proxy in') ? false : true
				}
			});
			chrome.storage.local.set({ apiKey: apiKey }, () => {
				console.log('API Key saved successfully:', apiKey);
			});
			setError(null);
			// set value to local storage
			localStorage.setItem('apiKey', apiKey);
			localStorage.setItem('location', location || 'all');
			localStorage.setItem('isConnected', 'true');
		} catch (error) {
			console.log(`error`, error);
			setError(error?.response?.data?.message || 'Có lỗi xảy ra');
			setIsConnected(false);
			setInfo(null);
			localStorage.removeItem('isConnected');
			chrome.runtime.sendMessage({
				type: 'proxy_disconnect',
			});
		} finally {
			setLoading(false);
		}
	};

	const handleDisconnectProxy = async () => {
		try {
			setIsConnected(false);
			setInfo(null);
			setIsAutoRefresh(false);
			localStorage.setItem('isConnected', 'false');
			localStorage.removeItem('proxy');
			localStorage.removeItem('isAutoRefresh');
			chrome.runtime.sendMessage({
				type: 'proxy_disconnect',
			});
		} catch (error) {
			console.log(`error`, error);
		}
	};

	const handleStopAutoRefresh = async (value: boolean) => {
		try {
			if (!value) {
				setIsAutoRefresh(false);
				setCountDown(0); // Reset countdown
				localStorage.setItem('isAutoRefresh', 'false');
				await chrome.runtime.sendMessage({
					type: 'proxy_stopAutoChangeIp',
					data: {}
				});
			} else {
				if (!isConnected) {
					setError('Please connect to proxy first');
					return;
				}
				setIsAutoRefresh(true);
				localStorage.setItem('isAutoRefresh', 'true');
				localStorage.setItem('seconds', seconds.toString());
				setCountDown(seconds); // Set initial countdown
				await chrome.runtime.sendMessage({
					type: 'proxy_autoChangeIp',
					data: {
						timeRefresh: seconds,
						apiKey,
						country: location,
						isAutoRefresh: true,
						isConnected
					}
				});
			}
		} catch (error) {
			console.error('Error in handleStopAutoRefresh:', error);
			setError('Failed to update auto refresh settings');
		}
	};

	useEffect(() => {
		handleFetchLocations();
		handleFetchCurrentProxy();
	}, []);

	useEffect(() => {
		const apiKey = localStorage.getItem('apiKey') || '';
		const location = localStorage.getItem('location');
		const type = localStorage.getItem('type');
		const savedIsAutoRefresh = localStorage.getItem('isAutoRefresh');
		const savedSeconds = localStorage.getItem('seconds');
		const isConnected = localStorage.getItem('isConnected');
		setApiKey(apiKey || '');
		setLocation(location || 'all');
		setType(type || 'all');
		if (savedIsAutoRefresh !== null) {
			setIsAutoRefresh(savedIsAutoRefresh === 'true');
		}
		if (savedSeconds !== null) {
			setSeconds(Number(savedSeconds) || 60);
		}
		if (isConnected === 'true') {
			setIsConnected(true);
		}
		chrome.storage.local.set({ apiKey: apiKey }, () => {
			console.log('API Key saved successfully:', apiKey);
		});
		chrome.storage.local.set({ location: location }, () => {
			console.log('location saved successfully:', location);
		});
		chrome.storage.local.set({ type: type }, () => {
			console.log('type saved successfully:', type);
		});
	}, []);

	useEffect(() => {
		const messageListener = (message) => {
			if (message.type === 'proxy_autoChangeIp_result') {
				setInfo(message.data.data);
				setTimeRefresh(message.data.data.nextChange || 0);
				setIsConnected(true);
			}
		};
		chrome.runtime.onMessage.addListener(messageListener);
		return () => {
			chrome.runtime.onMessage.removeListener(messageListener);
		};
	}, []);

	useEffect(() => {
		let intervalId: NodeJS.Timeout;

		const messageListener = (message: any) => {
			if (message.type === 'proxy_autoChangeIp_countdown') {
				const newCountdown = message?.data;
				if (typeof newCountdown === 'number' && newCountdown >= 0) {
					setCountDown(newCountdown);
				}
			}
		};

		if (isAutoRefresh) {
			chrome.runtime.onMessage.addListener(messageListener);
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
			chrome.runtime.onMessage.removeListener(messageListener);
		};
	}, [isAutoRefresh]);

	useEffect(() => {
		const interval = setInterval(() => {
			if (timeRefresh > 0) {
				setTimeRefresh(timeRefresh - 1);
				localStorage.setItem('timeRefresh', timeRefresh.toString());
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [timeRefresh]);

	useEffect(() => {
		localStorage.setItem('location', location);
		localStorage.setItem('type', type);
		chrome.storage.local.set({ location: location }, () => {
			console.log('location saved successfully:', location);
		});
		chrome.storage.local.set({ type: type }, () => {
			console.log('type saved successfully:', type);
		});
	}, [location, type]);

	useEffect(() => {
		return () => {
			// Cleanup function
			chrome.runtime.sendMessage({
				type: 'proxy_stopAutoChangeIp',
				data: {}
			});
		};
	}, []);

	return (
		<div className="w-[400px] font-inter">
			<Header />
			<ConfigProvider
				theme={{
					token: {
						colorPrimary: theme.primary,
						borderRadius: 6,
						fontFamily: 'Inter, sans-serif',
						fontSize: 12,
					},
				}}
			>
				<div className="bg-[#F9FAFB] p-4">
					
	{/* Move action buttons to top */}
	{isConnected && (
						<div className="mb-4">
							<div className="bg-white p-3 rounded-lg shadow-sm">
								<Row gutter={[16, 0]} className="items-center">
									<Col span={12}>
										<Button
											size="small"
											type="primary"
											onClick={handleRenewProxy}
											loading={isConnected && loading}
											className="w-full shadow-sm text-xs px-3 py-1 h-7"
											style={{ 
												backgroundColor: '#3498db', // Màu xanh dương Flat UI
												borderColor: '#3498db',
												boxShadow: 'none'
											}}
										>
											Rotate IP
										</Button>
									</Col>
									<Col span={12}>
										<Button
											size="small"
											type="primary"
											danger
											onClick={handleDisconnectProxy}
											className="w-full shadow-sm text-xs px-3 py-1 h-7"
											style={{ 
												boxShadow: 'none'
											}}
										>
											Disconnect
										</Button>
									</Col>
								</Row>
							</div>
						</div>
					)}
					
					{/* Proxy Info - without title */}
					{info && (
						<div className="bg-white p-3 rounded-lg shadow-sm space-y-2 mb-3">
							<Row gutter={[12, 8]} className="items-center">
								<Col span={8}>
									<span className="text-gray-600">Host</span>
								</Col>
								<Col span={16}>
									<Input 
										value={info?.proxy?.split(':')[0]} 
										disabled
										size="small"
										className="bg-gray-50 border-gray-200"
									/>
								</Col>
							</Row>

							<Row gutter={[12, 8]} className="items-center">
								<Col span={8}>
									<span className="text-gray-600">Port</span>
								</Col>
								<Col span={16}>
									<Input 
										value={info?.proxy?.split(':')[1]} 
										disabled
										size="small"
										className="bg-gray-50 border-gray-200"
									/>
								</Col>
							</Row>

							<Row gutter={[12, 8]} className="items-center">
								<Col span={8}>
									<span className="text-gray-600">Region</span>
								</Col>
								<Col span={16}>
									<Input 
										value={info?.country || ''} 
										disabled
										size="small"
										className="bg-gray-50 border-gray-200"
									/>
								</Col>
							</Row>

							<Row gutter={[12, 8]} className="items-center">
								<Col span={8}>
									<span className="text-gray-600">Type</span>
								</Col>
								<Col span={16}>
									{info?.isResidential ? (
										<Tag color="green" className="px-2 py-0.5 text-xs">Residential</Tag>
									) : (
										<Tag color="blue" className="px-2 py-0.5 text-xs">Datacenter</Tag>
									)}
								</Col>
							</Row>
						</div>
					)}

					{/* Auto Rotation - without title */}
					{isConnected && (
						<div className="bg-white p-3 rounded-lg shadow-sm mb-3">
							<Row gutter={[12, 8]} className="items-center">
								<Col span={8}>
									<span className="text-gray-600 text-xs">Auto-rotate</span>
								</Col>
								<Col span={8}>
									<InputNumber
										size="small"
										min={60}
										max={3600}
										value={seconds}
										onChange={(value) => {
											if (value) {
												setSeconds(value);
												localStorage.setItem('seconds', value.toString());
												// Nếu đang bật auto refresh thì update ngay
												if (isAutoRefresh) {
													handleStopAutoRefresh(false); // Tắt trước
													setTimeout(() => {
														handleStopAutoRefresh(true); // Bật lại với giá trị mới
													}, 100);
												}
											}
										}}
										className="w-full text-xs"
										addonAfter="s"
										disabled={!isConnected}
									/>
								</Col>
								<Col span={8} className="flex items-center justify-end gap-2">
									<Switch 
										size="small"
										onChange={handleStopAutoRefresh}
										checked={isAutoRefresh}
										className="bg-gray-200"
									/>
									{isAutoRefresh && countDown > 0 && (
										<span className="font-mono text-xs text-primary min-w-[30px]">
											{countDown}s
										</span>
									)}
								</Col>
							</Row>
						</div>
					)}

					{/* Settings - without title */}
					<div className="bg-white p-3 rounded-lg shadow-sm space-y-2">
						<Row gutter={[12, 8]}>
							<Col span={12}>
								<div className="space-y-1">
									<span className="text-gray-600 text-[11px]">Region</span>
									<Select
										size="small"
										value={location || 'all'}
										showSearch
										className="w-full text-xs"
										dropdownStyle={{ maxHeight: 300 }}
										onChange={(value) => setLocation(value)}
									>
										<Select.Option value="all">Global</Select.Option>
										{locations?.map((loc, index) => (
											<Select.Option key={index} value={loc}>{loc}</Select.Option>
										))}
									</Select>
								</div>
							</Col>
							<Col span={12}>
								<div className="space-y-1">
									<span className="text-gray-600 text-[11px]">Type</span>
									<Select
										size="small"
										value={type || 'all'}
										className="w-full text-xs"
										onChange={(value) => setType(value)}
									>
										<Select.Option value="all">All Types</Select.Option>
										<Select.Option value="residential">Residential</Select.Option>
										<Select.Option value="datacenter">Datacenter</Select.Option>
									</Select>
								</div>
							</Col>
						</Row>

						<div className="space-y-1">
							<span className="text-gray-600 text-[11px]">API Key</span>
							<Input
								size="small"
								value={apiKey}
								onChange={(e) => setApiKey(e.target.value)}
								placeholder="Enter your API key"
								className="font-mono text-xs"
							/>
							{error && (
								<div className="text-red-500 text-[11px]">{error}</div>
							)}
						</div>
					</div>

					{/* Connect button */}
					{!isConnected && (
						<div className="flex justify-end gap-2 mt-4">
							<Button
								size="small"
								type="primary"
								onClick={handleRenewProxy}
								loading={!isConnected && loading}
								className="shadow-sm text-xs px-3 py-1 h-7"
							>
								Connect
							</Button>
						</div>
					)}
				</div>
			</ConfigProvider>
			<Footer />
		</div>
	);
};

export default Popup;