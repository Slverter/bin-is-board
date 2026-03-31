'use client'

import { useBoardStore } from "@/src/useBoardStore"; // 경로가 맞는지 한 번 더 확인해 봐
import { useState, FormEvent } from "react";

export default function BoardPage() {
  // 스토어에서 status와 isLoading 상태도 함께 가져옴
  const { submitPost, status, isLoading } = useBoardStore();
  
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  // onClick 대신 onSubmit 이벤트 핸들러로 변경
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    const trimmedContent = content.trim();
    const trimmedAuthor = author.trim() || '익명';

    // 내용이 비어있으면 함수 종료
    if (!trimmedContent) {
      alert('내용을 입력해주세요.');
      return;
    }

    // 전송 완료 여부를 받아옴
    const success = await submitPost(trimmedAuthor, trimmedContent);
    
    // 성공 시 입력창 초기화
    if (success) {
      setContent('');
      setAuthor('');
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-screen overflow-hidden bg-[#111] text-white font-sans">
      <div className="fixed inset-0 z-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat contrast-[0.95] brightness-[0.7] [image-rendering:pixelated]" />
      <div className="fixed inset-0 z-10 bg-black/[0.28]" />
      
      <main className="relative z-20 w-[min(92vw,760px)] p-[clamp(16px,3vw,28px)] text-center">
        <h1 className="mb-4 text-[clamp(28px,4vw,48px)] font-bold leading-none tracking-[0.02em]">
          Bin = Board
        </h1>
        
        <section className="w-full bg-[#141414]/[0.78] border-2 border-white/[0.55] p-[clamp(14px,2.5vw,22px)] backdrop-blur-[2px]">
          {/* form에 onSubmit 연결 */}
          <form id="postForm" className="grid gap-[10px]" onSubmit={handleSubmit}>  
            <textarea 
              id="content" 
              name="content" 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용 입력"
              disabled={isLoading} // 전송 중일 때 입력 막기
              className="w-full min-h-[clamp(120px,20vw,180px)] resize-y p-3 border-2 border-[#d9d9d9] bg-white/[0.92] text-[#111] text-base leading-[1.45] rounded-none outline-none appearance-none disabled:opacity-50"
            /> 
            
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-[10px] items-stretch">
              <input 
                id="author" 
                name="author" 
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="게시자명 입력 (선택)" 
                disabled={isLoading} // 전송 중일 때 입력 막기
                className="w-full p-3 border-2 border-[#d9d9d9] bg-white/[0.92] text-[#111] text-base rounded-none outline-none appearance-none disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isLoading} // 전송 중 중복 클릭 방지
                className="w-full min-h-[48px] px-4 py-3 border-2 border-white bg-black text-white text-base cursor-pointer rounded-none hover:bg-[#222] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '게시 중...' : '게시하기'}
              </button>
            </div> 
            
            <p className="mt-[6px] text-xs text-white/[0.82] leading-[1.5] text-left">
              자유게시판에 게시하고 싶은 내용을 입력해주세요. 게시자명은 따로 입력하지 않으면 익명으로 업로드 됩니다.
            </p>
          </form>
          
          {/* 스토어의 상태 메시지(status)를 띄워줌 */}
          <div className="min-h-[20px] mt-3 text-[13px] text-[#f1f1f1] text-left">
            {status}
          </div>
          <div>
            <a href="https://www.instagram.com/bin_is_board/" className="py-2 px-4 border bg-black"
            target="_blank"
            rel="noopener noreferrer"
            >게시판 확인하러 가기</a>
          </div>
        </section>
      </main>
    </div>
  );
}