import {
    CheckCircle,
    Clock,
    Shield,
    Truck,
    Undo,
    HelpCircle,
    XCircle,
    AlertTriangle,
    Info,

} from "lucide-react";

import { FaShieldAlt } from "react-icons/fa";

// ============================================================
// 工具组件：减少重复 JSX
// ============================================================

// 1. 带勾选图标的列表项（用于 Terms）
const CheckItem = ({ children }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/50 hover:bg-emerald-50 transition-colors">
        <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
        <span className="text-sm text-slate-700 leading-none">{children}</span>
    </div>
);

// 2. 编号列表项（用于 Help / Returns）
const NumberedItem = ({ num, title, desc }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/30 border border-emerald-100/30 hover:bg-emerald-50/60 transition-colors">
        <div className="w-5 h-5 rounded-full bg-emerald-100/60 flex items-center justify-center flex-shrink-0 mt-1">
            <span className="font-bold text-emerald-700 leading-none text-xs">
                {num}
            </span>
        </div>
        <div>
            <span className="font-semibold text-left text-sm text-slate-800 block leading-5">
                {title}
            </span>
            <p className="text-xs text-slate-500 mt-0.5 leading-normal">
                {desc}
            </p>
        </div>
    </div>
);

// 3. 带图标 + 标题 + 描述的卡片（用于 Safety）
const SafetyItem = ({
    icon: Icon,
    iconColor,
    title,
    desc,
    borderColor,
    bgColor,
}) => (
    <div
        className={`flex items-start gap-3 p-3 rounded-xl border ${borderColor} ${bgColor}`}
    >
        <Icon className={`w-4 h-4 ${iconColor} flex-shrink-0 mt-[3px]`} />
        <div className="flex-1">
            <span className="font-semibold text-left text-sm text-slate-800 block leading-5">
                {title}
            </span>
            <p className="text-xs text-left text-slate-500 mt-0.5 leading-normal">
                {desc}
            </p>
        </div>
    </div>
);

// 4. 配送卡片（用于 Shipping）
const ShippingCard = ({ title, desc, badge, badgeColor, badgeBg }) => (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/30 border border-emerald-100/40">
        <div className="flex items-center gap-3 p-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/50 flex items-center justify-center">
                <Truck className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
                <span className="font-semibold text-left text-sm text-slate-800 block">
                    {title}
                </span>
                <p className="text-xs text-left text-slate-500 mt-0.5">
                    {desc}
                </p>
            </div>
        </div>
        <span
            className={`text-xs font-semibold ${badgeColor} ${badgeBg} px-2.5 py-1 rounded-full`}
        >
            {badge}
        </span>
    </div>
);

// 5. 圆点列表项（用于 Shipping 底部小提示）
const DotItem = ({ children }) => (
    <div className="flex items-center gap-2.5 p-1 px-3">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
        <span className="text-xs text-left text-slate-500 leading-none">
            {children}
        </span>
    </div>
);

// ============================================================
// 配置：数据驱动，干净简洁
// ============================================================

export const modalConfig = {
    terms: {
        icon: <CheckCircle />,
        title: "Terms Of Service",
        description: (
            <>
                <p className="mb-4 text-slate-700 text-sm sm:text-base">
                    By using Relove Market, you agree to keep your account
                    information accurate and follow all local laws and
                    marketplace guidelines.
                </p>
                <div className="space-y-2">
                    <CheckItem>
                        Only list items you own and can deliver.
                    </CheckItem>
                    <CheckItem>
                        Provide truthful descriptions, photos, and pricing.
                    </CheckItem>
                    <CheckItem>
                        Respect other users and keep communication professional.
                    </CheckItem>
                    <CheckItem>
                        Payments are processed securely through approved
                        channels.
                    </CheckItem>
                </div>
            </>
        ),
        note: "We may update these terms at any time to protect the community.",
        noteIcon: <Info />,
        primaryLabel: "Accept",
        secondaryLabel: "Close",
    },

    help: {
        icon: <HelpCircle />,
        title: "Help Center",
        description: (
            <>
                <p className="mb-4 text-slate-700 text-sm sm:text-base">
                    Need help with an order, payment, or account? Start here.
                </p>
                <div className="space-y-2">
                    <NumberedItem
                        num="1"
                        title="Order Tracking"
                        desc="Track your orders in real-time with delivery updates."
                    />
                    <NumberedItem
                        num="2"
                        title="Payment Support"
                        desc="Get help with payment methods, refunds, and billing."
                    />
                    <NumberedItem
                        num="3"
                        title="Account Management"
                        desc="Update your profile, password, and preferences easily."
                    />
                    <NumberedItem
                        num="4"
                        title="Seller Guidelines"
                        desc="Learn about seller requirements, policies, and best practices."
                    />
                </div>
            </>
        ),
        note: "For urgent issues, email us at relovemarket006@gmail.com",
        noteIcon: <Clock />,
        primaryLabel: "Got It",
    },

    safety: {
        icon: <Shield />,
        title: "Safety Guidelines",
        description: (
            <>
                <p className="mb-4 text-slate-700 text-sm sm:text-base">
                    Stay safe while buying and selling. Follow these simple
                    tips:
                </p>
                <div className="space-y-2">
                    <SafetyItem
                        icon={Shield}
                        iconColor="text-emerald-600"
                        borderColor="border-emerald-100"
                        bgColor="bg-emerald-50/40"
                        title="Keep Communication Inside"
                        desc="Always use our platform's messaging system for all communications."
                    />
                    <SafetyItem
                        icon={AlertTriangle}
                        iconColor="text-amber-600"
                        borderColor="border-amber-100"
                        bgColor="bg-amber-50/30"
                        title="Never Share Passwords"
                        desc="Keep your passwords and OTP codes private at all times."
                    />
                    <SafetyItem
                        icon={CheckCircle}
                        iconColor="text-teal-600"
                        borderColor="border-teal-100"
                        bgColor="bg-teal-50/30"
                        title="Meet in Public Places"
                        desc="Always verify items before paying and meet in safe, public locations."
                    />
                    <SafetyItem
                        icon={XCircle}
                        iconColor="text-rose-500"
                        borderColor="border-rose-100"
                        bgColor="bg-rose-50/30"
                        title="Report Suspicious Activity"
                        desc="Immediately report any suspicious behavior to our support team."
                    />
                </div>
            </>
        ),
        note: "We monitor listings and users, but your awareness is the best protection.",
        noteIcon: <Shield />,
        primaryLabel: "Understood",
    },

    shipping: {
        icon: <Truck />,
        title: "Shipping Information",
        description: (
            <>
                <p className="mb-4 text-slate-700 text-sm sm:text-base">
                    We work with trusted couriers to deliver items safely and
                    quickly.
                </p>
                <div className="space-y-2">
                    <ShippingCard
                        title="Standard Delivery"
                        desc="3-7 business days"
                        badge="Free over RM 50"
                        badgeColor="text-emerald-700"
                        badgeBg="bg-emerald-100/60"
                    />
                    <ShippingCard
                        title="Express Delivery"
                        desc="1-3 business days"
                        badge="RM 15 flat rate"
                        badgeColor="text-teal-700"
                        badgeBg="bg-teal-100/60"
                    />
                    <DotItem>
                        Tracking numbers are available once items are shipped.
                    </DotItem>
                    <DotItem>
                        Shipping fees are clearly shown at checkout.
                    </DotItem>
                </div>
            </>
        ),
        note: "Delivery timelines may vary based on location and seller availability.",
        noteIcon: <Clock />,
        primaryLabel: "Got It",
    },

    returns: {
        icon: <Undo />,
        title: "Returns & Refunds",
        description: (
            <>
                <p className="mb-4 text-slate-700 text-sm sm:text-base">
                    If an item arrives damaged or not as described, you can
                    request a return.
                </p>
                <div className="space-y-2">
                    <NumberedItem
                        num="1"
                        title="Submit Request"
                        desc={
                            <>
                                Must be submitted within{" "}
                                <span className="font-semibold text-amber-600">
                                    3 days
                                </span>{" "}
                                of delivery.
                            </>
                        }
                    />
                    <NumberedItem
                        num="2"
                        title="Provide Evidence"
                        desc="Include photos and order details for review."
                    />
                    <NumberedItem
                        num="3"
                        title="Refund Processing"
                        desc="Refunds are processed back to original payment method."
                    />
                </div>
            </>
        ),
        note: "We're here to help if you have any questions about returns.",
        noteIcon: <Clock />,
        primaryLabel: "Close",
    },

    privacy: {
        icon: <Shield />,
        title: "Privacy Policy",
        description: (
            <>
                <p className="mb-4 text-slate-700 text-sm sm:text-base">
                    Your privacy is important to us. This Privacy Policy
                    explains how we collect, use, and protect your personal
                    information.
                </p>
                <div className="space-y-3">
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                            Information We Collect
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                            We collect information you provide directly to us,
                            such as when you create an account, use our
                            services, or contact us for support.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                            How We Use Information
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                            We use the information we collect to provide,
                            maintain, and improve our services, and to develop
                            new ones.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">
                            Data Security
                        </h4>
                        <p className="text-gray-600 text-sm sm:text-base">
                            We implement appropriate technical and
                            organizational measures to protect your personal
                            information against unauthorized access.
                        </p>
                    </div>
                </div>
            </>
        ),
        note: "We're committed to protecting your privacy. Contact us if you have any questions.",
        noteIcon: <Shield />,
        primaryLabel: "Close",
    },
};

export const modalTypes = Object.keys(modalConfig);
