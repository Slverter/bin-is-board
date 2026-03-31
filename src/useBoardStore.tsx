import { create } from 'zustand';

interface BoardState {
  isLoading: boolean;
  status: string;
  submitPost: (author: string, content: string) => Promise<boolean>;
}

export const useBoardStore = create<BoardState>((set) => ({
  isLoading: false,
  status: '', // 진행 상황이나 결과 메시지를 담을 상태

  submitPost: async (author, content) => {
    set({ isLoading: true, status: '게시 중...' });

    try {
      // 클라이언트 측 타임스탬프 생성 (ISO 8601 형식)
      const timestamp = new Date().toISOString(); 
      
      // 환경변수에서 구글 앱스 스크립트 URL을 가져옴
      const SCRIPT_URL = process.env.NEXT_PUBLIC_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwe1NXqMF2CURJgkK0m3fi3Pc4RUksw69OZX79pfJJpHjgf4HBZKHacp541p4Os0_e9/exec';

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        // 구글 앱스 스크립트의 CORS 이슈를 피하기 위해 보통 text/plain을 사용해
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({ timestamp, author, content }),
      });

      const result = await response.json();
      if (result.ok) {
        set({ isLoading: false, status: '게시되었습니다.' });
        return true; // 성공 여부 반환
      } else {
        set({ isLoading: false, status: `오류: ${result.error || '알 수 없는 문제'}` });
        console.log(result);
        return false;
      }
    } catch (error: any) {
      set({ isLoading: false, status: `전송 실패: ${error.message}` });
      return false;    
    }
  },
}));