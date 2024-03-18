Hive는 다음과 같은 목적으로 대배너를 제공합니다.

* 게임을 이용하는 유저에게 이벤트를 효과적으로 노출
* 이용중인 게임에 더 많은 참여를 유도하는 목적으로 활용
* 다른 게임을 광고하고 보상을 제공하는 크로스 프로모션으로 활용



Hive가 정의하는 배너는 글자 없이 이미지 하나를 통째로 올리는 형식의 프로모션 뷰를 의미합니다. 유저가 배너를 클릭하면 Hive 콘솔에 등록된 내용에 따라 상세 페이지, 외부 페이지, 또는 광고 게임의 다운로드 페이지로 이동합니다. 배너 이미지를 전체 화면에 표시하는 대배너 특성상 로그인 직후 게임 로비에 진입하는 시점에 노출하기를 권장합니다.

### Registering a full banner in the Hive console 2.0
배너 이미지는 가로, 세로 모드에 따라 다음과 같이 안내하는 크기로 제작하여 Hive 콘솔에 등록하세요. 대배너를 등록하는 방법에 대한 자세한 내용은 [Hive 콘솔 프로모션](../../../operation/promotion/event_cam) 가이드를 참고하세요.

* 프로모션 배너 이미지 사이즈
	+ 가로 모드: 450x800 px
	+ 세로 모드: 800x450 px
* 크로스 플레이를 이용하는 게임은 1280×720 이미지를 등록해주세요.


### 대배너 띄우기


* 대배너 예시 화면
[![](http://developers.withhive.com/wp-content/uploads/2020/09/promotion_fullbanner_kr_200820.png)](http://developers.withhive.com/wp-content/uploads/2020/09/promotion_fullbanner_kr_200820.png)



대배너를 표시하려면 `PromotionType.BANNER` 파라미터를 포함하여 **Promotion** 클래스의 `showPromotion()` 메서드를 호출합니다. Hive SDK v4.12.1부터 `PromotionType.BANNER`는 웹 배너, 이외의 경우에는 이미지 뷰 형태로 적용되었습니다. `PromotionType.BANNERLEGACY`를 호출할 때는 기존과 동일하게 웹뷰가 적용된 배너를 노출합니다.

`PromotionType.BANNER` 타입으로 대배너를 띄울 때는 Hive SDK 초기화 과정에 비동기로 저장(캐싱)된 앱 내 저장소 영역의 이미지를 노출합니다. 다운로드가 완료되지 않았거나 실패한 상황에 대배너를 띄우면 배너 노출을 생략합니다.

다음은 대배너를 띄우는 예제 코드입니다.
=== "Unity"

    ```cs
    // 프로모션 뷰를 대배너 타입으로 설정하기    
        PromotionType promotionType = PromotionType.BANNER;    
        // true라면 ‘오늘 하루 다시보지 않기’ 버튼을 표시하지 않음. 혹 오늘 이미 유저가 다시 보지 않도록 설정했더라도 무시하고 대배너를 띄움    
        Boolean isForced = false;     
        // 대배너 띄우기 결과 콜백 핸들러    
        public void onPromotionViewCB(ResultAPI result, PromotionEventType promotionEventType) {    
            if(result.isSuccess()){    
                // API 호출 성공    
            }    
        }    
        // 대배너 띄우기    
    hive.Promotion.showPromotion(promotionType, isForced, onPromotionViewCB);
    ```

=== "C++"

    ```cpp
    // 프로모션 뷰를 대배너 타입으로 설정하기    
        PromotionType promotionType = PromotionType::BANNER;    
        // true라면 ‘오늘 하루 다시보지 않기’ 버튼을 표시하지 않음. 혹 오늘 이미 유저가 다시 보지 않도록 설정했더라도 무시하고 대배너를 띄움    
        bool isForced = false;    
        // 대배너 띄우기    
        Promotion::showPromotion(promotionType, isForced, [=](ResultAPI result, PromotionEventType promotionEventType){    
           // 대배너 띄우기 결과 콜백 함수    
           if(result.isSuccess()){    
               // API 호출 성공    
            }    
    });
    ```

=== "Java"

    ```java
    // 프로모션 뷰를 대배너 타입으로 설정하기    
        PromotionViewType promotionViewType = PromotionViewType.BANNER;    
        // true라면 ‘오늘 하루 다시보지 않기’ 버튼을 표시하지 않음. 혹 오늘 이미 유저가 다시 보지 않도록 설정했더라도 무시하고 대배너를 띄움    
        boolean isForced = false;    
        // 대배너 띄우기    
        com.hive.Promotion.showPromotion(promotionViewType, isForced, new Promotion.PromotionViewListener() {    
          @Override    
          public void onPromotionView(ResultAPI result, Promotion.PromotionViewResultType type) {    
            // 대배너 띄우기 결과 콜백 리스너    
            if(result.isSuccess()){    
                // API 호출 성공    
            }    
          }    
    });
    ```

=== "Objective-C"

    ```objc
    // 프로모션 뷰를 대배너 타입으로 설정하기    
        HIVEPromotionViewType promotionType = kHIVEPromotionViewTypeBANNER;    
        // true라면 ‘오늘 하루 다시보지 않기’ 버튼을 표시하지 않음. 혹 오늘 이미 유저가 다시 보지 않도록 설정했더라도 무시하고 대배너를 띄움    
        BOOL isForced = false;    
        // 대배너 띄우기    
        [HIVEPromotion showPromotion:promotionType isForced:isForced handler:^(HIVEResultAPI* result, HIVEPromotionViewResultType promotionViewResultType) {    
            // 대배너 띄우기 결과 콜백 핸들러    
            if (result.isSuccess) {    
                 // API 호출 성공    
            }    
    }];
    ```
