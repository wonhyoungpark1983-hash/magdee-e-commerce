import { useState, useEffect } from 'react';
import { Search, Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, ExternalLink, TrendingUp } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import Button from '../components/Button';
import Input from '../components/Input';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
    const { getOrdersByPhone, loading } = useProducts();
    const [phone, setPhone] = useState(localStorage.getItem('magdee_last_phone') || '');
    const [searchedOrders, setSearchedOrders] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (phone && !hasSearched) {
            handleSearch();
        }
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const orders = getOrdersByPhone(phone);
        setSearchedOrders(orders);
        setHasSearched(true);
        localStorage.setItem('magdee_last_phone', phone);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': return <Clock className="text-orange-500" size={20} />;
            case 'SHIPPED': return <Truck className="text-blue-500" size={20} />;
            case 'COMPLETED': return <CheckCircle className="text-green-500" size={20} />;
            case 'CANCELLED': return <XCircle className="text-red-500" size={20} />;
            default: return <Package className="text-gray-500" size={20} />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'PENDING': return '결제 대기';
            case 'SHIPPED': return '배송 시작';
            case 'COMPLETED': return '배송 완료';
            case 'CANCELLED': return '주문 취소';
            default: return status;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">주문 내역을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" />
                    쇼핑 계속하기
                </Link>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">내 주문 조회</h1>
                        <p className="text-gray-500">주문 시 입력한 연락처를 통해 주문 현황을 확인할 수 있습니다.</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                            <div className="flex-1">
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="연락처를 입력하세요 (010-1234-5678)"
                                    className="w-full"
                                    icon={Search}
                                />
                            </div>
                            <Button type="submit" variant="primary" className="px-8 shadow-lg shadow-primary/20">
                                조회
                            </Button>
                        </form>

                        {hasSearched && searchedOrders.length > 0 && (
                            <div className="flex items-center justify-between mb-8 px-2">
                                <p className="text-sm font-medium text-gray-500">
                                    총 <span className="text-primary font-bold">{searchedOrders.length}</span>건의 주문이 있습니다
                                </p>
                                <button
                                    onClick={() => { setPhone(''); setSearchedOrders([]); setHasSearched(false); }}
                                    className="text-xs text-gray-400 hover:text-primary transition-colors underline underline-offset-4"
                                >
                                    초기화
                                </button>
                            </div>
                        )}

                        {!hasSearched ? (
                            <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                <Package size={48} className="mx-auto text-gray-200 mb-4" />
                                <p className="text-gray-900 font-bold text-lg">주문 내역 조회</p>
                                <p className="text-gray-500 mt-1 max-w-[240px] mx-auto text-sm leading-relaxed">
                                    구매 시 입력하신 휴대폰 번호를 입력하면 실시간 배송 현황을 확인하실 수 있습니다.
                                </p>
                            </div>
                        ) : searchedOrders.length === 0 ? (
                            <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                                <XCircle size={48} className="mx-auto text-red-100 mb-4" />
                                <p className="text-gray-900 font-bold text-lg">주문 내역이 없습니다.</p>
                                <p className="text-gray-500 mt-1 text-sm">입력하신 연락처를 다시 확인해 주세요.</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {searchedOrders.map((order) => (
                                    <div key={order.id} className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-gray-100/50 transition-all duration-300">
                                        <div className="bg-gray-50/50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-white rounded-xl shadow-sm">
                                                    {getStatusIcon(order.status)}
                                                </div>
                                                <span className="font-extrabold text-gray-900 tracking-tight">{getStatusText(order.status)}</span>
                                            </div>
                                            <span className="text-[10px] font-mono font-bold text-gray-300 bg-gray-100 px-2.5 py-1 rounded-full uppercase">
                                                #{order.id.slice(0, 8)}
                                            </span>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex flex-col sm:flex-row gap-6">
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="font-extrabold text-gray-900 text-xl leading-tight group-hover:text-primary transition-colors">
                                                                {order.product_name}
                                                            </h3>
                                                            <p className="text-sm font-medium text-gray-400 mt-1.5 flex items-center gap-2">
                                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">SIZE: {order.size}</span>
                                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-bold">COLOR: {order.color}</span>
                                                            </p>
                                                        </div>
                                                        <p className="text-2xl font-black text-gray-900 tracking-tighter">
                                                            ₩{(order.price || 0).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-50 text-sm">
                                                        <div className="space-y-1">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">배송 주소</p>
                                                            <p className="text-gray-600 font-medium leading-relaxed">{order.address}</p>
                                                        </div>
                                                        <div className="space-y-1 sm:text-right">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">주문 일시</p>
                                                            <p className="text-gray-600 font-medium">{new Date(order.created_at).toLocaleString('ko-KR', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="mt-6 flex items-center justify-end border-t border-gray-50 pt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                <Link to={`/product/${order.product_id}`} className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline">
                                                    상품 정보 보기 <ExternalLink size={12} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrdersPage;
