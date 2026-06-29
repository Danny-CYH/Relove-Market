import { useState, useEffect, useRef } from "react";
import {
    FaRecycle,
    FaLeaf,
    FaShieldAlt,
    FaUsers,
    FaChevronDown,
    FaChevronUp,
    FaQuoteLeft,
    FaArrowRight,
} from "react-icons/fa";
import CountUp from "react-countup";
import { motion, useInView, AnimatePresence } from "framer-motion";

import { Link, usePage } from "@inertiajs/react";

import Footer from "@/Components/Ui/Footer";
import Navbar from "@/Components/Ui/Navbar";

export default function AboutUs() {
    // authenticate user
    const { auth } = usePage().props;

    /*************************************
     * Variable Declaration
     *************************************/
    const [activeFAQ, setActiveFAQ] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const statsRef = useRef(null);

    // Refs for scroll animations
    const storyRef = useRef(null);
    const valuesRef = useRef(null);
    const teamRef = useRef(null);
    const testimonialRef = useRef(null);
    const faqRef = useRef(null);
    const ctaRef = useRef(null);

    // Check if elements are in view
    const isStoryInView = useInView(storyRef, { once: true, amount: 0.2 });
    const isValuesInView = useInView(valuesRef, { once: true, amount: 0.2 });
    const isTeamInView = useInView(teamRef, { once: true, amount: 0.2 });
    const isTestimonialInView = useInView(testimonialRef, {
        once: true,
        amount: 0.3,
    });
    const isFaqInView = useInView(faqRef, { once: true, amount: 0.2 });
    const isCtaInView = useInView(ctaRef, { once: true, amount: 0.3 });

    /*************************************
     * Function Declaration
     *************************************/
    const toggleFAQ = (index) => {
        setActiveFAQ(activeFAQ === index ? null : index);
    };

    // 检测 stats 区域是否进入视口
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 },
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const faqItems = [
        {
            question: "How do I create an account?",
            answer: "Click the 'Sign Up' button in the top right corner and follow the simple registration process. You can sign up with your email or social media accounts for convenience.",
        },
        {
            question: "I forgot my password. What should I do?",
            answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email. You'll be able to reset your password securely and quickly.",
        },
        {
            question: "How do I list an item for sale?",
            answer: "Once logged in, click 'Sell Item' in the navigation. Upload photos, add a description, set your price, and categorize your item. Our AI will help suggest the best category and price range!",
        },
        {
            question: "What items can I sell on Relove?",
            answer: "You can sell any preloved items in good condition, including clothing, electronics, home goods, books, and more. We prohibit certain items for safety reasons - see our guidelines for details.",
        },
        {
            question: "How does Relove ensure transaction safety?",
            answer: "We use secure payment processing, buyer protection programs, and verify all users. Our rating system helps build trust within our community, and our support team is always available to help resolve issues.",
        },
    ];

    const teamMembers = [
        {
            name: "Michael Torres",
            role: "Product Manager",
            image: "/image/collaborator1.jpg",
            bio: "Passionate about sustainable fashion and reducing waste.",
        },
        {
            name: "Sarah Chen",
            role: "Head of Technology",
            image: "/image/collaborator2.jpg",
            bio: "Believes technology can drive positive environmental change.",
        },
        {
            name: "Priya Patel",
            role: "Community Manager",
            image: "/image/collaborator3.jpg",
            bio: "Loves connecting people through shared sustainable values.",
        },
        {
            name: "David Kim",
            role: "Product Designer",
            image: "/image/collaborator4.jpg",
            bio: "Creates experiences that make sustainable choices easy and enjoyable.",
        },
    ];

    const stats = [
        { value: 50000, label: "Active Users", suffix: "+" },
        { value: 200000, label: "Items Listed", suffix: "+" },
        { value: 85, label: "Satisfaction Rate", suffix: "%" },
        { value: 120, label: "Tons of Waste Reduced", suffix: "+" },
    ];

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const fadeInLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.7, ease: "easeOut" },
        },
    };

    const fadeInRight = {
        hidden: { opacity: 0, x: 50 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.7, ease: "easeOut" },
        },
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const staggerItem = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="flex flex-col min-h-screen bg-white overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative py-20 bg-gradient-to-br from-green-50 to-blue-50"
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmNWY3ZjkiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                </div>
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-4xl mx-auto text-center md:mt-5"
                    >
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
                        >
                            About{" "}
                            <span className="text-green-600">
                                Relove Market
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
                        >
                            Our mission is to give preloved items a new home and
                            reduce waste while building a community of mindful
                            consumers who believe in sustainable shopping.
                        </motion.p>
                        <motion.div
                            ref={statsRef}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                            className="flex flex-wrap justify-center gap-4 mt-10"
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.6 + index * 0.1,
                                    }}
                                    className="min-w-full bg-white rounded-xl p-6 shadow-sm text-center md:min-w-[180px]"
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                >
                                    <div className="text-3xl font-bold text-green-600 mb-2">
                                        {isVisible ? (
                                            <CountUp
                                                start={0}
                                                end={stat.value}
                                                duration={2.5}
                                                suffix={stat.suffix || ""}
                                            />
                                        ) : (
                                            "0" + (stat.suffix || "")
                                        )}
                                    </div>
                                    <div className="text-gray-600 text-sm">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Story Section */}
            <motion.section
                ref={storyRef}
                initial="hidden"
                animate={isStoryInView ? "visible" : "hidden"}
                variants={fadeInUp}
                className="py-16 lg:py-24 px-4"
            >
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <motion.div variants={fadeInLeft} className="lg:w-1/2">
                            <div className="relative">
                                <motion.img
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                    src="../image/story_of_us.jpg"
                                    alt="Relove Market team"
                                    className="rounded-2xl shadow-xl w-full"
                                />
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={
                                        isStoryInView
                                            ? { opacity: 1, x: 0 }
                                            : {}
                                    }
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="absolute -bottom-6 -right-6 bg-green-600 text-white p-6 rounded-2xl shadow-lg hidden md:block"
                                >
                                    <div className="text-3xl font-bold">
                                        2025
                                    </div>
                                    <div className="text-sm">
                                        Founded with passion
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div variants={fadeInRight} className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                The Journey of Relove Market
                            </h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Relove Market was born from a simple idea: that
                                one person's unused items could become another's
                                treasure. We started in 2025 with a small
                                community of enthusiasts passionate about
                                sustainability and reducing waste.
                            </p>
                            <p className="text-gray-600 mb-8 leading-relaxed">
                                What began as a local exchange program quickly
                                grew into a comprehensive platform where people
                                can buy, sell, and trade preloved items with
                                confidence and ease. Today, we're proud to have
                                helped thousands of items find new homes,
                                reducing landfill waste and creating a more
                                sustainable future for all.
                            </p>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={isStoryInView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.5, delay: 0.6 }}
                                className="flex items-center gap-4"
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        src="/image/ceo.jpg"
                                        alt="Founder signature"
                                        className="w-12 h-5 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        Danny Cheng
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Founder & CEO
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Values Section */}
            <motion.section
                ref={valuesRef}
                initial="hidden"
                animate={isValuesInView ? "visible" : "hidden"}
                variants={fadeInUp}
                className="py-16 bg-gray-50 px-4"
            >
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        variants={fadeInUp}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Our Values
                        </h2>
                        <p className="text-gray-600 text-lg">
                            These core principles guide everything we do at
                            Relove Market and shape our community.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isValuesInView ? "visible" : "hidden"}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {[
                            {
                                icon: <FaUsers className="text-3xl" />,
                                title: "Community",
                                description:
                                    "Building connections through shared values and sustainable practices.",
                                color: "text-pink-500",
                            },
                            {
                                icon: <FaRecycle className="text-3xl" />,
                                title: "Sustainability",
                                description:
                                    "Extending product lifecycles and reducing environmental impact.",
                                color: "text-blue-500",
                            },
                            {
                                icon: <FaLeaf className="text-3xl" />,
                                title: "Mindful Consumption",
                                description:
                                    "Encouraging thoughtful purchasing decisions and less waste.",
                                color: "text-green-500",
                            },
                            {
                                icon: <FaShieldAlt className="text-3xl" />,
                                title: "Trust & Safety",
                                description:
                                    "Creating a secure platform for users to exchange with confidence.",
                                color: "text-indigo-500",
                            },
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{
                                    y: -10,
                                    boxShadow:
                                        "0 20px 25px -5px rgba(0,0,0,0.1)",
                                    transition: { duration: 0.2 },
                                }}
                                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                            >
                                <motion.div
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                    }}
                                    className={`flex justify-center items-center w-16 h-16 rounded-2xl ${value.color} bg-opacity-10 mx-auto mb-6`}
                                >
                                    {value.icon}
                                </motion.div>
                                <h3 className="font-semibold text-lg text-gray-900 mb-3">
                                    {value.title}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {value.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Team Section */}
            <motion.section
                ref={teamRef}
                initial="hidden"
                animate={isTeamInView ? "visible" : "hidden"}
                variants={fadeInUp}
                className="py-16 px-4"
            >
                <div className="container mx-auto max-w-6xl">
                    <motion.div
                        variants={fadeInUp}
                        className="text-center max-w-3xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Meet Our Team
                        </h2>
                        <p className="text-gray-600 text-lg">
                            The passionate individuals working to make
                            sustainable shopping accessible to everyone.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isTeamInView ? "visible" : "hidden"}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                whileHover={{ y: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="text-center group"
                            >
                                <div className="relative mb-6 overflow-hidden rounded-2xl">
                                    <motion.img
                                        whileHover={{ scale: 1.08 }}
                                        transition={{ duration: 0.4 }}
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full max-h-72 md:h-64 object-cover"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-6"
                                    >
                                        <p className="text-white text-sm px-4">
                                            {member.bio}
                                        </p>
                                    </motion.div>
                                </div>
                                <h3 className="font-semibold text-gray-900 text-lg">
                                    {member.name}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    {member.role}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Testimonial Section */}
            <motion.section
                ref={testimonialRef}
                initial="hidden"
                animate={isTestimonialInView ? "visible" : "hidden"}
                variants={scaleIn}
                className="py-16 bg-green-50 px-4"
            >
                <div className="container mx-auto max-w-5xl">
                    <motion.div
                        variants={fadeInUp}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            What Our Community Says
                        </h2>
                    </motion.div>

                    <motion.div
                        whileHover={{
                            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
                        }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-2xl shadow-sm p-8 md:p-12"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={
                                    isTestimonialInView
                                        ? { opacity: 1, scale: 1 }
                                        : {}
                                }
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="md:w-1/3 text-center"
                            >
                                <motion.img
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                    src="/image/shania_yan.png"
                                    alt="Happy user"
                                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                                />
                                <div className="text-2xl font-bold text-green-600 mb-1">
                                    4.8/5
                                </div>
                                <div className="flex justify-center items-center mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            className="w-5 h-5 text-yellow-400 fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm">
                                    Based on 2,458 reviews
                                </p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={
                                    isTestimonialInView
                                        ? { opacity: 1, x: 0 }
                                        : {}
                                }
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="md:w-2/3"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={
                                        isTestimonialInView
                                            ? { opacity: 1, scale: 1 }
                                            : {}
                                    }
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <FaQuoteLeft className="text-green-200 text-3xl mb-4" />
                                </motion.div>
                                <p className="text-gray-700 text-lg italic mb-6">
                                    "Relove Market has completely changed how I
                                    shop. I've found amazing unique pieces while
                                    knowing I'm reducing waste. The community is
                                    wonderful and the process is so easy!"
                                </p>
                                <div>
                                    <div className="font-semibold text-gray-900">
                                        Jessica Lim
                                    </div>
                                    <div className="text-gray-500 text-sm">
                                        Active member since 2025
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* FAQ Section */}
            <motion.section
                ref={faqRef}
                initial="hidden"
                animate={isFaqInView ? "visible" : "hidden"}
                variants={fadeInUp}
                className="py-16 px-4 bg-gray-50"
            >
                <div className="container mx-auto max-w-4xl">
                    <motion.div
                        variants={fadeInUp}
                        className="text-center max-w-3xl mx-auto mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600">
                            Find answers to common questions about using Relove
                            Market.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate={isFaqInView ? "visible" : "hidden"}
                        className="space-y-4"
                    >
                        {faqItems.map((faq, index) => (
                            <motion.div
                                key={index}
                                variants={staggerItem}
                                initial={{ opacity: 0, y: 20 }}
                                animate={
                                    isFaqInView ? { opacity: 1, y: 0 } : {}
                                }
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.08,
                                }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden"
                            >
                                <motion.button
                                    whileHover={{ backgroundColor: "#f9fafb" }}
                                    className="flex justify-between items-center w-full p-6 text-left font-semibold text-gray-900"
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span>{faq.question}</span>
                                    <motion.span
                                        animate={{
                                            rotate:
                                                activeFAQ === index ? 180 : 0,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {activeFAQ === index ? (
                                            <FaChevronUp className="text-gray-500" />
                                        ) : (
                                            <FaChevronDown className="text-gray-500" />
                                        )}
                                    </motion.span>
                                </motion.button>
                                <AnimatePresence>
                                    {activeFAQ === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{
                                                opacity: 1,
                                                height: "auto",
                                            }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 pt-2 text-gray-600">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isFaqInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-center mt-12"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Our support team is here to help you
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center"
                        >
                            Contact Us <FaArrowRight className="ml-2" />
                        </motion.button>
                    </motion.div>
                </div>
            </motion.section>

            {/* CTA Section */}
            <motion.section
                ref={ctaRef}
                initial="hidden"
                animate={isCtaInView ? "visible" : "hidden"}
                variants={scaleIn}
                className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white"
            >
                <div className="container mx-auto px-4 text-center">
                    <motion.h2
                        variants={fadeInUp}
                        className="text-3xl md:text-4xl font-bold mb-6"
                    >
                        Join Our Sustainable Community
                    </motion.h2>
                    <motion.p
                        variants={fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
                    >
                        Be part of the movement changing how we shop and
                        reducing waste one preloved item at a time.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        {auth.user ? (
                            auth.user.role_name === "Seller" ? (
                                <Link href={route("seller-dashboard")}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-md"
                                    >
                                        Go to Seller Dashboard
                                    </motion.button>
                                </Link>
                            ) : auth.user.role_name === "Buyer" ? (
                                <Link href={route("homepage")}>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-md"
                                    >
                                        Go to Homepage
                                    </motion.button>
                                </Link>
                            ) : null
                        ) : (
                            <Link href={route("register")}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-md"
                                >
                                    Create Account
                                </motion.button>
                            </Link>
                        )}
                    </motion.div>
                </div>
            </motion.section>

            <Footer />
        </div>
    );
}
