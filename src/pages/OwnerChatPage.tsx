
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, MoreVertical, Bell, BellOff, Slash, Clock, Check, CheckCheck, MapPin, Camera, Paperclip, Send, Mic } from 'lucide-react';
import { TruckOwner, ChatMessage, MessageStatus } from '../types';
import { CONSTANTINE_COORDS, TRANSLATIONS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { useNotifications } from '../hooks/useNotifications';
import { db } from '../firebase';
import { collection, query, onSnapshot, where, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';

const OwnerChatPage = ({ user, currentLang }: { user: TruckOwner, currentLang: string }) => {
  const [activeChat, setActiveChat] = useState<string | null>(null); // userId of person we are chatting with
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [mutedChats, setMutedChats] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [contacts, setContacts] = useState<TruckOwner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { notify } = useNotifications();
  
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { primaryColor, textColor } = useTheme();
  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS];

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, 'users'), where('role', '==', 'driver'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const contactsData: TruckOwner[] = [];
      snapshot.forEach(doc => {
        if (doc.id !== user.id) {
          contactsData.push({ id: doc.id, ...doc.data() } as TruckOwner);
        }
      });
      setContacts(contactsData);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat, isTyping]);

  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData: ChatMessage[] = [];
      snapshot.forEach(doc => {
        const data = doc.data() as ChatMessage;
        if (data.senderId === activeChat || data.receiverId === activeChat) {
          messagesData.push({ id: doc.id, ...data });
        }
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [activeChat, user.id]);

  // Send Message Logic
  const handleSend = async (text = inputText, type: 'text' | 'location' = 'text', locData?: {lat: number, lng: number}) => {
    if ((!text.trim() && type === 'text') || !activeChat) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(), // Firestore will generate an ID
      senderId: user.id,
      receiverId: activeChat,
      text: text,
      timestamp: Date.now(),
      status: 'sent',
      type: type,
      locationData: locData
    };
    
    setInputText('');
    setShowAttachments(false);

    await addDoc(collection(db, 'chats'), {
      ...newMessage,
      participants: [user.id, activeChat],
      timestamp: serverTimestamp()
    });
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
         (pos) => {
           const { latitude, longitude } = pos.coords;
           handleSend("Current Location", 'location', { lat: latitude, lng: longitude });
         },
         (error) => {
           console.error("Geolocation error:", error);
           // Fallback on error
           handleSend("Constantine (Mock)", 'location', CONSTANTINE_COORDS);
         }
       );
    } else {
      // Fallback if not supported
      handleSend("Constantine (Mock)", 'location', CONSTANTINE_COORDS);
    }
  };

  const toggleBlock = (contactId: string) => {
    if (blockedUsers.includes(contactId)) {
      setBlockedUsers(blockedUsers.filter(id => id !== contactId));
    } else {
      setBlockedUsers([...blockedUsers, contactId]);
    }
    setShowOptions(false);
  };

  const toggleMute = (contactId: string) => {
    if (mutedChats.includes(contactId)) {
      setMutedChats(mutedChats.filter(id => id !== contactId));
    } else {
      setMutedChats([...mutedChats, contactId]);
    }
    setShowOptions(false);
  };

  const renderMessageStatus = (status: MessageStatus) => {
    if (status === 'sending') return <Clock size={12} className="text-gray-400" />;
    if (status === 'sent') return <Check size={12} className="text-gray-400" />;
    if (status === 'delivered') return <CheckCheck size={12} className="text-gray-400" />;
    if (status === 'read') return <CheckCheck size={12} className="text-blue-500" />;
    return null;
  };

  if (activeChat) {
    const chatPartner = contacts.find(c => c.id === activeChat);
    if (!chatPartner) return null; // Should not happen

    const conversation = messages;
    
    const isBlocked = blockedUsers.includes(activeChat);
    const isMuted = mutedChats.includes(activeChat);

    return (
      <div className={`flex flex-col h-[calc(100vh-140px)] bg-${textColor}-50 ${currentLang === 'ar' ? 'rtl' : ''}`}>
         {/* Chat Header */}
         <div className="bg-white p-3 shadow-sm flex justify-between items-center z-20">
            <div className="flex items-center">
              <button onClick={() => setActiveChat(null)} className="mr-2">
                 <ChevronLeft size={24} className={`text-${textColor}-600 ${currentLang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
              <div className="flex items-center">
                <div className="relative mr-2">
                   <div className={`w-10 h-10 rounded-full bg-${primaryColor}-100 flex items-center justify-center text-${primaryColor}-600 font-bold`}>
                     {chatPartner.companyName.substring(0, 1)}
                   </div>
                   {chatPartner.isAvailable && (
                     <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                   )}
                </div>
                <div>
                  <h3 className={`font-bold text-sm text-${textColor}-800`}>{chatPartner.companyName}</h3>
                  <span className={`text-[10px] ${isTyping ? 'text-green-600 font-bold animate-pulse' : 'text-gray-400'}`}>
                    {isTyping ? t.typing : chatPartner.isAvailable ? t.online : t.offlineStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative">
              <button onClick={() => setShowOptions(!showOptions)} className={`p-2 rounded-full hover:bg-gray-100 text-${textColor}-500`}>
                <MoreVertical size={20} />
              </button>
              {showOptions && (
                <div className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 ${currentLang === 'ar' ? 'left-0 right-auto' : ''}`}>
                  <button onClick={() => toggleMute(activeChat)} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-2 text-sm">
                    {isMuted ? <Bell size={16} /> : <BellOff size={16} />}
                    <span>{isMuted ? t.unmuteChat : t.muteChat}</span>
                  </button>
                  <button onClick={() => toggleBlock(activeChat)} className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center space-x-2 text-sm text-red-600">
                    <Slash size={16} />
                    <span>{isBlocked ? t.unblockUser : t.blockUser}</span>
                  </button>
                </div>
              )}
            </div>
         </div>

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
            {/* Date Separator Mock */}
            <div className="flex justify-center my-4">
              <span className="bg-gray-200 text-gray-600 text-[10px] px-3 py-1 rounded-full">{t.today || "Today"}</span>
            </div>

            {conversation.map((msg, index) => {
              const isMe = msg.senderId === user.id;
              // Grouping logic could go here (check if prev msg same sender)
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[75%] group relative ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                     <div className={`p-3 rounded-2xl text-sm shadow-sm relative ${isMe ? `bg-${primaryColor}-600 text-white rounded-br-none` : 'bg-white text-gray-800 rounded-bl-none'}`}>
                       {msg.type === 'location' ? (
                         <div className="flex flex-col space-y-2">
                           <div className="flex items-center space-x-2">
                             <MapPin size={16} />
                             <span className="font-bold underline">Location Shared</span>
                           </div>
                           <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden relative">
                             {/* Mini map placeholder */}
                             <div className="absolute inset-0 flex items-center justify-center bg-gray-300">
                               <MapPin size={12} className="text-gray-500" />
                             </div>
                           </div>
                         </div>
                       ) : (
                         msg.text
                       )}
                       
                       <div className={`text-[9px] mt-1 flex items-center justify-end space-x-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                         <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         {isMe && renderMessageStatus(msg.status)}
                       </div>
                     </div>
                   </div>
                </div>
              );
            })}
            
            {isTyping && (
              <div className="flex justify-start">
                 <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                 </div>
              </div>
            )}
            
            {isBlocked && (
              <div className="text-center text-xs text-red-500 bg-red-50 py-2 rounded mt-4">
                You have blocked this user.
              </div>
            )}
         </div>

         {/* Input Area */}
         {!isBlocked && (
           <div className="bg-white p-2 border-t border-gray-100 pb-[env(safe-area-inset-bottom)] z-20">
             {/* Quick Actions / Attachments */}
             {showAttachments && (
                <div className="flex space-x-4 p-3 bg-gray-50 rounded-lg mb-2 mx-2 animate-fade-in-up">
                   <button onClick={shareLocation} className="flex flex-col items-center space-y-1 text-gray-600 hover:text-green-600">
                     <div className="p-3 bg-green-100 rounded-full text-green-600">
                       <MapPin size={20} />
                     </div>
                     <span className="text-[10px]">Location</span>
                   </button>
                   <button className="flex flex-col items-center space-y-1 text-gray-600 hover:text-blue-600">
                     <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                       <Camera size={20} />
                     </div>
                     <span className="text-[10px]">Camera</span>
                   </button>
                </div>
             )}

             <div className="flex items-end space-x-2">
               <button 
                 onClick={() => setShowAttachments(!showAttachments)}
                 className={`p-3 rounded-full hover:bg-gray-100 text-gray-500 transition-colors ${showAttachments ? 'bg-gray-200' : ''}`}
               >
                 <Paperclip size={20} />
               </button>
               
               <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center">
                 <textarea 
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={t.typeMessage}
                    className="w-full bg-transparent outline-none text-sm resize-none max-h-24 py-1"
                    rows={1}
                    onKeyDown={e => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                 />
               </div>
               
               {inputText.trim() ? (
                 <button onClick={() => handleSend()} className={`bg-${primaryColor}-600 text-white p-3 rounded-full hover:bg-${primaryColor}-700 shadow-md transition-all transform hover:scale-105 active:scale-95`}>
                   <Send size={18} />
                 </button>
               ) : (
                 <button className="bg-gray-200 text-gray-500 p-3 rounded-full hover:bg-gray-300">
                   <Mic size={18} />
                 </button>
               )}
             </div>
             
             {/* Quick Replies */}
             <div className="flex space-x-2 mt-2 overflow-x-auto pb-1 px-1 scrollbar-hide">
               {["I'm arriving", "Send location", "Ok", "Call me"].map(reply => (
                 <button 
                   key={reply}
                   onClick={() => handleSend(reply)}
                   className="whitespace-nowrap px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 border border-gray-200"
                 >
                   {reply}
                 </button>
               ))}
             </div>
           </div>
         )}
      </div>
    );
  }

  // Contact List View
  return (
    <div className={`p-4 pb-20 ${currentLang === 'ar' ? 'rtl' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-bold text-lg text-${textColor}-800`}>{t.contacts}</h2>
        <div className="flex space-x-2">
           <button className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
             <Bell size={18} />
           </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center text-sm text-gray-500 py-8">
          Loading contacts...
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(contact => {
            const isBlocked = blockedUsers.includes(contact.id);
            // Mock last message
            const lastMsg = "Hey, are you available?";
            const lastTime = "10:30 AM";
            
            return (
              <button 
                key={contact.id} 
                onClick={() => setActiveChat(contact.id)}
                className={`w-full bg-white p-4 rounded-xl shadow-sm border border-${textColor}-100 flex items-center justify-between hover:bg-gray-50 transition-colors ${isBlocked ? 'opacity-50 grayscale' : ''}`}
              >
                <div className="flex items-center space-x-3 overflow-hidden">
                   <div className={`relative flex-shrink-0`}>
                     <div className={`w-12 h-12 bg-${primaryColor}-100 rounded-full flex items-center justify-center text-${primaryColor}-600 font-bold text-lg`}>
                       {contact.companyName.substring(0, 1)}
                     </div>
                     {contact.isAvailable && (
                       <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                     )}
                   </div>
                   <div className="text-left min-w-0">
                     <div className="flex justify-between items-center w-full">
                       <h4 className={`font-bold text-sm text-${textColor}-800 truncate pr-2`}>{contact.companyName}</h4>
                     </div>
                     <p className={`text-xs text-${textColor}-500 truncate`}>{isBlocked ? '(Blocked)' : lastMsg}</p>
                   </div>
                </div>
                <div className="flex flex-col items-end pl-2">
                   <span className="text-[10px] text-gray-400 whitespace-nowrap mb-1">{lastTime}</span>
                   {/* Unread badge mock */}
                   {contact.id === 'o2' && (
                     <span className={`w-5 h-5 bg-${primaryColor}-600 text-white text-[10px] rounded-full flex items-center justify-center`}>2</span>
                   )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerChatPage;
